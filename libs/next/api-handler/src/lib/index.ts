import { NextRequest, NextResponse } from 'next/server';
import { CustomError } from './apiErrorHandlers';

export interface ApiHandlerOptions {
  req: NextRequest;
}

export const handleApiRequest = <T extends ApiHandlerOptions>(
  handler: (options: T) => Promise<NextResponse>,
) => {
  return async (options: T): Promise<NextResponse> => {
    try {
      return await handler(options);
    } catch (error) {
      if (error instanceof CustomError) {
        return new NextResponse(JSON.stringify({ error: error.message }), {
          status: error.statusCode,
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        // Handle unexpected errors
        return new NextResponse(
          JSON.stringify({ error: 'Internal Server Error' }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          },
        );
      }
    }
  };
};

export default handleApiRequest;
