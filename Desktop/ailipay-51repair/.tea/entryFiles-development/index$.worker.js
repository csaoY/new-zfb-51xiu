require('./config$');

function success() {
require('../..//app');
require('../../pages/index/index');
require('../../pages/brand/brand');
require('../../pages/recycling/recycling');
require('../../pages/memoryUpgrade/memoryUpgrade');
require('../../pages/more/more');
require('../../pages/login/login');
require('../../pages/brand/selectmodel/selectmodel');
require('../../pages/brand/detailed/detailed');
require('../../pages/brand/placeorder/placeorder');
require('../../pages/last/fixlast/last');
require('../../pages/last/rebuylast/last');
require('../../pages/assessment/assessment');
require('../../pages/assessment/assessment_list/assessment_list');
require('../../pages/assessment/placeorder/placeorder');
require('../../pages/clause/recoveryclause/recoveryclause');
require('../../pages/clause/maintenanceclause/maintenanceclause');
require('../../pages/more/orderitemre/orderitemre');
require('../../pages/more/myorder/myorder');
require('../../pages/more/send/send');
require('../../pages/more/orderitem/orderitem');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
