import express, { Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import routes from '~/routes/v1';
import { httpLogger } from '~/middlewares/logger.middleware';
import notFound from '~/middlewares/notFound';
import globalErrorHandler from '~/middlewares/globalErrorHandler';
import { swaggerMiddleware, document } from '~/swagger';

const app = express();


app.use(helmet());                                                          // secure HTTP headers
app.use(httpLogger);                                                        // log requests
app.use(cors());                                                 // cors policy
app.use(express.json());                                                    // parse JSON body
app.use(express.urlencoded({ extended: true }));                            // parse URL-encoded/form-data body
app.use('/api/v1', routes);
app.use('/docs/v1', ...swaggerMiddleware);
app.get("/docs-v1/swagger.json", (_, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(document);
});
app.get('/', (_, res: Response) => {
    res.status(200).send('Welcome to Vehicle Rental System Backend API');
});
app.use(notFound);
app.use(globalErrorHandler);

export default app;
