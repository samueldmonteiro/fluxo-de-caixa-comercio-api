/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: user@email.com
 *         password:
 *           type: string
 *           example: password123
 * 
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         name:
 *           type: string
 *           example: Davi
 *         email:
 *           type: string
 *           example: user@email.com
 *         role:
 *           type: string
 *           example: ADMIN or USER
 * 
 *     Movement:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         type:
 *           type: string
 *           example: INCOME or EXPENSE
 *         value:
 *           type: number
 *           example: 150.0
 *         description:
 *           type: string
 *           example: "example test"
 * 
 *         userId:
 *           type: number
 *           example: 1
 * 
 *         categoryId:
 *           type: number
 *           example: 2
 *         date:
 *           type: string
 *           format: date-time
 *           example: 2025-11-26T12:00:00Z
 * 
 * 
 *     Category:
 *       type: object
 *       properties:
*         id:
*           type: number
*           example: 1
*        
*         userId:
*           type: number
*           example: 1
*         name:
*           type: string
*           example: Pagamento X
*/
