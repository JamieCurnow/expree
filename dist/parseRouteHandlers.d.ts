import { RequestHandler } from 'express';
import { RouteDefinition } from './types';
export declare const parseRouteHandlers: (route: RouteDefinition) => RequestHandler[];
