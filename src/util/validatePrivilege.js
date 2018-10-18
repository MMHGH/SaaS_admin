import validator from './validator'

const validatePrivilege = {
  privilegeCode: function(rule, value, callback, code){
    switch(code){
      case 'code.generate.general.stock': validator.limitNum(callback, value, 0, 1000000000); break;
      case 'organ.levelNum':validator.limitNum(callback, value, 0, 10); break;
      case 'code.generate.general.per_max_qty':validator.limitNum(callback, value, 0, 1000000); break;
      case 'prizeNum':validator.limitNum(callback, value, 0, 100000); break;
      case 'template.turntable':validator.limitNum(callback, value, 0, 10000); break;
      case 'like':validator.limitNum(callback, value, 0, 100000); break;
      case 'user.accountTime':validator.limitNum(callback, value, 0, 3600); break;
      case 'score':validator.limitNum(callback, value, 0, 1000000); break;
      case 'templateDiscount':validator.limitNum(callback, value, 0, 100); break;
      case 'likeDiscount':validator.limitNum(callback, value, 0, 100); break;
      case 'scoreDiscount':validator.limitNum(callback, value, 0, 100); break;
      case 'goodsNum':validator.limitNum(callback, value, 0, 100000); break;
      case 'code.generate.visual.stock':validator.limitNum(callback, value, 0, 500000); break;
      case 'code.generate.visual.per_max_qty':validator.limitNum(callback, value, 0, 50000); break;
      case 'code.generate.package.stock':validator.limitNum(callback, value, 0, 1000000000); break;
      case 'code.generate.package.per_max_qty':validator.limitNum(callback, value, 0, 1000000); break;
      case 'accountNum':validator.limitNum(callback, value, 0, 2000); break;
      case 'prizeDiscount':validator.limitNum(callback, value, 0, 100); break;
      case 'roleNum':validator.limitNum(callback, value, 0, 1000); break;
      case 'organTypeNum':validator.limitNum(callback, value, 0, 5000); break;
      case 'organNum':validator.limitNum(callback, value, 0, 2000); break;
      case 'adminNum':validator.limitNum(callback, value, 0, 1000); break;
      case 'goods.discount.coupons':validator.limitNum(callback, value, 0, 100); break;
      case 'goods.discount.telephone_charge':validator.limitNum(callback, value, 0, 100); break;
      case 'goods.discount.wx_red_packet':validator.limitNum(callback, value, 0, 100); break;
      case 'goods.discount.prize':validator.limitNum(callback, value, 0, 100); break;
      case 'goods.discount.cinema_ticket':validator.limitNum(callback, value, 0, 100); break;
      case 'template.open_treasure_chest':validator.limitNum(callback, value, 0, 10000); break;
      case 'template.money_tree':validator.limitNum(callback, value, 0, 10000); break;
      case 'open_create_prize':validator.limitNum(callback, value, 0, 1000); break;
      case 'open_create_score':validator.limitNum(callback, value, 0, 1000); break;
      case 'msg.num':validator.limitNum(callback, value, 0, 1000000); break;
      default: validator.limitNum(callback, value, 0, 100000);
    }
  },
  unitName: function(rule, value, callback, name){
    switch(name){
      case '个':
      case '天': validator.onlyNum(callback, value, '请输入整数'); break;
      case '%':
      default: validator.onlyFloat(callback, value, '请输入有效数值');
    }
  }
}

export default validatePrivilege
