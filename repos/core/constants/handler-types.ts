/**
 * When add new HandlerType:
 * 1. Add handler interfaces to `../interfaces/handlers.ts`
 * 2. Add handler decorator to `../decorators/handlers.ts`
 * 3. Add handler's mapper to `../router/telegram-api-handlers-adapter.ts`
 */
export enum HandlerTypes {
    Message = "message",
    CallbackQuery = "callback_query",
    Animation = "animation",
    Audio = "audio",
    ChannelChatCreated = "channel_chat_created",
    ChannelPost = "channel_post",
    ChatInviteLink = "chat_invite_link",
    ChatJoinRequest = "chat_join_request",
    ChatMember = "chat_member",
    ChatMemberUpdated = "chat_member_updated",
    ChosenInlineResult = "chosen_inline_result",
    Contact = "contact",
    DeleteChatPhoto = "delete_chat_photo",
    Document = "document",
    EditedChannelPost = "edited_channel_post",
    EditedChannelPostCaption = "edited_channel_post_caption",
    EditedChannelPostText = "edited_channel_post_text",
    EditedMessage = "edited_message",
    EditedMessageCaption = "edited_message_caption",
    EditedMessageText = "edited_message_text",
    Error = "error",
    Game = "game",
    GroupChatCreated = "group_chat_created",
    InlineQuery = "inline_query",
    Invoice = "invoice",
    LeftChatMember = "left_chat_member",
    Location = "location",
    MessageAutoDeleteTimerChanged = "message_auto_delete_timer_changed",
    MigrateFromChatId = "migrate_from_chat_id",
    MigrateToChatId = "migrate_to_chat_id",
    MyChatMember = "my_chat_member",
    NewChatMembers = "new_chat_members",
    NewChatPhoto = "new_chat_photo",
    NewChatTitle = "new_chat_title",
    PassportData = "passport_data",
    Photo = "photo",
    PinnedMessage = "pinned_message",
    PollAnswer = "poll_answer",
    PollingError = "polling_error",
    PreCheckoutQuery = "pre_checkout_query",
    ShippingQuery = "shipping_query",
    Sticker = "sticker",
    SuccessfulPayment = "successful_payment",
    SupergroupChatCreated = "supergroup_chat_created",
    Text = "text",
    Video = "video",
    VideoChatEnded = "video_chat_ended",
    VideoChatParticipantsInvited = "video_chat_participants_invited",
    VideoChatScheduled = "video_chat_scheduled",
    VideoChatStarted = "video_chat_started",
    VideoNote = "video_note",
    Voice = "voice",
    WebAppData = "web_app_data",
    WebhookError = "webhook_error"
}
  