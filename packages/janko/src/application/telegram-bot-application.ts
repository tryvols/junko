import "reflect-metadata";
import TelegramAPI from "node-telegram-bot-api";
import { Container, interfaces } from "inversify";
import {
    Router,
    HandlersContainer,
    AvailableHandlersProvider,
    UnhandledEventValidator
} from "../router";
import { MetadataScanner } from "../core";
import { AppErrorHandler, TelegramBotApplicationOptions } from "../interfaces";
import {
    APPLICATION_METADATA_ACCESSOR,
    AVAILABLE_HANDLERS_PROVIDER,
    CONTROLLER,
    DEFAULT_ERROR,
    ERROR_HANDLER,
    HANDLERS_ABSENCE_ERROR,
    HANDLERS_CONTAINER,
    METADATA_SCANNER,
    MIDDLEWARE,
    MIDDLEWARE_CONTROLLER,
    ROUTER,
    TELEGRAM_API,
    UNHANDLED_EVENT_VALIDATOR
} from "../constants";
import { LoggerService, LOGGER, LoggingMiddleware, Middleware, MiddlewareController } from "../middleware";
import { DefaultError, ApplicationErrorHandler, HandlersAbsenceError } from "../errors";
import { ApplicationMetadataAccessor } from "../metadata";

export class TelegramBotApplication {
    private readonly container = new Container();

    constructor(options: TelegramBotApplicationOptions) {
        this.initServices(options);
        this.initApplicationShutdownHandler();
        this.initInternalMiddlewares(options);

        this.container.get<LoggerService>(LOGGER).log("Application initialized!");
    }

    private initServices(options: TelegramBotApplicationOptions) {
        this.container.bind<TelegramAPI>(TELEGRAM_API).toDynamicValue(() => {
            return new TelegramAPI(options.token, options);
        }).inSingletonScope();
        this.container.bind<Router>(ROUTER).to(Router).inSingletonScope();
        this.container.bind<MetadataScanner>(METADATA_SCANNER).to(MetadataScanner).inSingletonScope();
        this.container.bind<MiddlewareController>(MIDDLEWARE_CONTROLLER).to(MiddlewareController).inSingletonScope();
        this.container.bind<AppErrorHandler>(ERROR_HANDLER).to(ApplicationErrorHandler).inSingletonScope();
        this.container.bind<HandlersContainer>(HANDLERS_CONTAINER).to(HandlersContainer).inSingletonScope();
        this.container.bind<ApplicationMetadataAccessor>(APPLICATION_METADATA_ACCESSOR)
            .to(ApplicationMetadataAccessor).inSingletonScope();
        this.container.bind<AvailableHandlersProvider>(AVAILABLE_HANDLERS_PROVIDER)
            .to(AvailableHandlersProvider).inSingletonScope();
        this.container.bind<UnhandledEventValidator>(UNHANDLED_EVENT_VALIDATOR)
            .to(UnhandledEventValidator).inSingletonScope();
        // Errors
        this.container.bind<interfaces.Newable<Error>>(DEFAULT_ERROR).toConstructor(DefaultError);
        this.container.bind<interfaces.Newable<Error>>(HANDLERS_ABSENCE_ERROR).toConstructor(HandlersAbsenceError);
    }

    private initInternalMiddlewares(options: TelegramBotApplicationOptions): void {
        this.useMiddleware(LoggingMiddleware, { isEnable: !!options.logging });
    }

    getContainer(): Container {
        return this.container;
    }

    run(): void {
        // Router is the main node of the application
        this.container.get(ROUTER);
        this.container.get<LoggerService>(LOGGER).log("Application started!");
    }

    registerController<T>(controller: interfaces.Newable<T>): void {
        this.container.bind<T>(CONTROLLER).to(controller);
    }

    useMiddleware<T>(middleware: interfaces.Newable<Middleware<T>>, config?: T): void {
        // At first we register required dependencies that are using with inversify
        Object.getPrototypeOf(middleware)?.beforeInit?.(this.container, config);
        const middlewareInstance = this.container.resolve<Middleware>(middleware);
        middlewareInstance.onInit?.(config);
        this.container.bind<Middleware<T>>(MIDDLEWARE).toConstantValue(middlewareInstance);
    }

    private initApplicationShutdownHandler() {
        process.on("SIGTERM", () => {
            const middleware = this.container.getAll<Middleware>(MIDDLEWARE);
            middleware.forEach(m => m?.onDestroy?.());
            this.container.get<LoggerService>(LOGGER).log("Application destroyed!");
        });
    }
}
