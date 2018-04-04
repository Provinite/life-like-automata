import { LifeLikeSimulatorApplication } from './life-like-simulator-application'
(async () => {
    let app : LifeLikeSimulatorApplication = new LifeLikeSimulatorApplication();
    await app.start();
    process.exit(0);
})();
