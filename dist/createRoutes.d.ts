import { Express } from 'express';
/** Options for route locations and prefixes */
interface CreateRoutesOption {
    /**
     * The directory to find all of the routes. Defaults to 'routes'.
     * Can be an absolute path or a relative path to the app root.
     */
    routesDirectory: string;
    /**
     * The prefix to add to all routes. Defaults to '/'.
     */
    routePrefix?: string;
}
/** Create all the routes and register them in the express app */
export declare const createRoutes: (app: Express, options?: CreateRoutesOption | CreateRoutesOption[] | undefined) => Promise<Express>;
export {};
