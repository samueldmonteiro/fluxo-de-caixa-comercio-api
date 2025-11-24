import app from '../app';
import listEndpoints from 'express-list-endpoints';

console.log('==================== DEBUG ====================');
console.log('Tipo do app:', typeof app);
console.log('Conteúdo bruto do app:', app);
console.log('Stack size:', (app as any)?._router?.stack?.length);
console.log('===============================================');

console.table(listEndpoints(app));
