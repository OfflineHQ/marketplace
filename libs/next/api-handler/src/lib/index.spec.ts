import { NextRequest, NextResponse } from 'next/server';
import {
  BadRequestError,
  InternalServerError,
  NotAuthorizedError,
  ForbiddenError,
  NotFoundError,
} from './apiErrorHandlers';
import handleApiRequest from './index';

// Mock NextResponse to capture responses
jest.mock('next/server', () => ({
  NextResponse: jest.fn().mockImplementation((body, init) => ({
    body,
    status: init?.status,
    headers: init?.headers,
  })),
}));

describe('handleApiRequest', () => {
  const mockRequest = {} as NextRequest; // Simplified mock of NextRequest

  it('should handle successful requests', async () => {
    const handler = jest.fn().mockResolvedValue(new NextResponse('Success'));
    const wrappedHandler = handleApiRequest(handler);

    const response = await wrappedHandler(mockRequest);

    expect(response.body).toBe('Success');
    expect(response.status).toBeUndefined(); // Success does not set a status code
  });

  it('should handle successful requests with options', async () => {
    const mockOptions = {
      req: {} as NextRequest, // Simplified mock of NextRequest
      contractAddress: '0x123',
      chainId: '1',
    };
    const handler = jest.fn().mockResolvedValue(new NextResponse('Success'));
    const wrappedHandler = handleApiRequest(handler);

    const response = await wrappedHandler(mockOptions);

    expect(response.body).toBe('Success');
    expect(response.status).toBeUndefined(); // Success does not set a status code
  });

  it('should handle NotAuthorizedError with a 401 status', async () => {
    const handler = jest
      .fn()
      .mockRejectedValue(new NotAuthorizedError('Unauthorized access'));
    const wrappedHandler = handleApiRequest(handler);

    const response = await wrappedHandler(mockRequest);

    expect(response.body).toBe(
      JSON.stringify({ error: 'Unauthorized access' }),
    );
    expect(response.status).toBe(401);
  });

  it('should handle ForbiddenError with a 403 status', async () => {
    const handler = jest
      .fn()
      .mockRejectedValue(new ForbiddenError('Forbidden'));
    const wrappedHandler = handleApiRequest(handler);

    const response = await wrappedHandler(mockRequest);

    expect(response.body).toBe(JSON.stringify({ error: 'Forbidden' }));
    expect(response.status).toBe(403);
  });

  it('should handle BadRequestError with a 400 status', async () => {
    const handler = jest
      .fn()
      .mockRejectedValue(new BadRequestError('Invalid input'));
    const wrappedHandler = handleApiRequest(handler);

    const response = await wrappedHandler(mockRequest);

    expect(response.body).toBe(JSON.stringify({ error: 'Invalid input' }));
    expect(response.status).toBe(400);
  });

  it('should handle InternalServerError with a 500 status', async () => {
    const handler = jest
      .fn()
      .mockRejectedValue(new InternalServerError('Server error'));
    const wrappedHandler = handleApiRequest(handler);

    const response = await wrappedHandler(mockRequest);

    expect(response.body).toBe(JSON.stringify({ error: 'Server error' }));
    expect(response.status).toBe(500);
  });

  it('should handle unexpected errors with a 500 status', async () => {
    const handler = jest.fn().mockRejectedValue(new Error('Unexpected error'));
    const wrappedHandler = handleApiRequest(handler);

    const response = await wrappedHandler(mockRequest);

    expect(response.body).toBe(
      JSON.stringify({ error: 'Internal Server Error' }),
    );
    expect(response.status).toBe(500);
  });

  it('should handle NotFoundError with a 404 status', async () => {
    const handler = jest.fn().mockRejectedValue(new NotFoundError('Not found'));
    const wrappedHandler = handleApiRequest(handler);

    const response = await wrappedHandler(mockRequest);

    expect(response.body).toBe(JSON.stringify({ error: 'Not found' }));
    expect(response.status).toBe(404);
  });
});
