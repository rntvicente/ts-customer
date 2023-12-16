export interface EventDispatcher {
  notify(topicArn: string, message: string): void;
}
