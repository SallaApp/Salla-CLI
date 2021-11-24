/**
 *  this function is exeucted on "${event-name}" action triggered by Salla .
 *
 * Action Body received from Salla
 * @param {Object} eventBody
 * { 
 *  event: '${event-name}',
    merchant: 472944967,
    created_at: '2021-11-22 13:51:57',
    data:
 *    {
 *      "id":1911645512,
 *      "app_name":"app name",
 *      "app_description":"desc",
 *      "app_type":"app",
 *      "app_scopes":[ 
 *        'settings.read',
 *        'customers.read_write',
 *        'orders.read_write',
 *        'carts.read',
 *        ...
 *      ],
 *      "installation_date":"2021-11-21 11:07:13"
 *    }
 * }
 * Arguments passed by you:
 * @param {Object} userArgs
 * { key:"val" }
 * @api public
 */
module.exports = (eventBody, userArgs) => {
  // your logic here
  return null;
};
