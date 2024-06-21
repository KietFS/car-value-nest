import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  //The execution context can abstract the WebSocket context,
  //the gRPC context, the HTTP context, and the RPC context, graphql context, etc.
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
