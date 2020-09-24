const codeMap = {
  '00': {
    city: { '全国': '00' },
    code: { '00': '全国' }
  },
  '11': {
    city: { '北京': '11' },
    code: { '11': '北京' }
  },
  '12': {
    city: { '天津': '12' },
    code: { '12': '天津' }
  },
  '13': {
    city: {
      '河北': '13',
      '石家庄市': '1301',
      '唐山市': '1302',
      '秦皇岛市': '1303',
      '邯郸市': '1304',
      '邢台市': '1305',
      '保定市': '1306',
      '张家口市': '1307',
      '承德市': '1308',
      '沧州市': '1309',
      '廊坊市': '1310',
      '衡水市': '1311'
    },
    code: {
      '13': '河北',
      '1301': '石家庄市',
      '1302': '唐山市',
      '1303': '秦皇岛市',
      '1304': '邯郸市',
      '1305': '邢台市',
      '1306': '保定市',
      '1307': '张家口市',
      '1308': '承德市',
      '1309': '沧州市',
      '1310': '廊坊市',
      '1311': '衡水市'
    }
  },
  '14': {
    city: {
      '山西': '14',
      '太原市': '1401',
      '大同市': '1402',
      '阳泉市': '1403',
      '长治市': '1404',
      '晋城市': '1405',
      '朔州市': '1406',
      '晋中市': '1407',
      '运城市': '1408',
      '忻州市': '1409',
      '临汾市': '1410',
      '吕梁市': '1411'
    },
    code: {
      '14': '山西',
      '1401': '太原市',
      '1402': '大同市',
      '1403': '阳泉市',
      '1404': '长治市',
      '1405': '晋城市',
      '1406': '朔州市',
      '1407': '晋中市',
      '1408': '运城市',
      '1409': '忻州市',
      '1410': '临汾市',
      '1411': '吕梁市'
    }
  },
  '15': {
    city: {
      '内蒙古': '15',
      '呼和浩特市': '1501',
      '呼和浩特市市辖区': '150101',
      '新城区': '150102',
      '回民区': '150103',
      '玉泉区': '150104',
      '赛罕区': '150105',
      '土默特左旗': '150121',
      '托克托县': '150122',
      '和林格尔县': '150123',
      '清水河县': '150124',
      '武川县': '150125',
      '包头市': '1502',
      '包头市市辖区': '150201',
      '东河区': '150202',
      '昆都伦区': '150203',
      '青山区': '150204',
      '石拐矿区': '150205',
      '白云矿区': '150206',
      '九原区': '150207',
      '土默特右旗': '150221',
      '固阳县': '150222',
      '达尔罕茂明安联合旗': '150223',
      '乌海市': '1503',
      '乌海市市辖区': '150301',
      '海勃湾区': '150302',
      '海南区': '150303',
      '乌达区': '150304',
      '赤峰市': '1504',
      '赤峰市市辖区': '150401',
      '红山区': '150402',
      '元宝山区': '150403',
      '松山区': '150404',
      '阿鲁科尔沁旗': '150421',
      '巴林左旗': '150422',
      '巴林右旗': '150423',
      '林西县': '150424',
      '克什克腾旗': '150425',
      '翁牛特旗': '150426',
      '喀喇沁旗': '150428',
      '宁城县': '150429',
      '敖汉旗': '150430',
      '通辽市': '1505',
      '通辽市市辖区': '150501',
      '科尔沁区': '150502',
      '科尔沁左翼中旗': '150521',
      '科尔沁左翼后旗': '150522',
      '开鲁县': '150523',
      '库伦旗': '150524',
      '奈曼旗': '150525',
      '扎鲁特旗': '150526',
      '霍林郭勒市': '150581',
      '鄂尔多斯市': '1506',
      '鄂尔多斯市市辖区': '150601',
      '东胜区': '150602',
      '达拉特旗': '150621',
      '准格尔旗': '150622',
      '鄂托克前旗': '150623',
      '鄂托克旗': '150624',
      '杭锦旗': '150625',
      '乌审旗': '150626',
      '伊金霍洛旗': '150627',
      '呼伦贝尔市': '1507',
      '呼伦贝尔市市辖区': '150701',
      '海拉尔区': '150702',
      '阿荣旗': '150721',
      '莫力达瓦达斡尔族自治旗': '150722',
      '鄂伦春自治旗': '150723',
      '鄂温克族自治旗': '150724',
      '陈巴尔虎旗': '150725',
      '新巴尔虎左旗': '150726',
      '新巴尔虎右旗': '150727',
      '满洲里市': '150781',
      '牙克石市': '150782',
      '扎兰屯市': '150783',
      '额尔古纳市': '150784',
      '根河市': '150785',
      '巴彦淖尔市': '1508',
      '巴彦淖尔市市辖区': '150801',
      '临河区': '150802',
      '五原县': '150821',
      '磴口县': '150822',
      '乌拉特前旗': '150823',
      '乌拉特中旗': '150824',
      '乌拉特后旗': '150825',
      '杭锦后旗': '150826',
      '乌兰察布市': '1509',
      '乌兰察布市市辖区': '150901',
      '集宁区': '150902',
      '卓资县': '150921',
      '化德县': '150922',
      '商都县': '150923',
      '兴和县': '150924',
      '凉城县': '150925',
      '察哈尔右翼前旗': '150926',
      '察哈尔右翼中旗': '150927',
      '察哈尔右翼后旗': '150928',
      '四子王旗': '150929',
      '丰镇市': '150981',
      '兴安盟': '1522',
      '乌兰浩特市': '152201',
      '阿尔山市': '152202',
      '科尔沁右翼前旗': '152221',
      '科尔沁右翼中旗': '152222',
      '扎赉特旗': '152223',
      '突泉县': '152224',
      '锡林郭勒盟': '1525',
      '二连浩特市': '152501',
      '锡林浩特市': '152502',
      '阿巴嘎旗': '152522',
      '苏尼特左旗': '152523',
      '苏尼特右旗': '152524',
      '东乌珠穆沁旗': '152525',
      '西乌珠穆沁旗': '152526',
      '太仆寺旗': '152527',
      '镶黄旗': '152528',
      '正镶白旗': '152529',
      '正蓝旗': '152530',
      '多伦县': '152531',
      '阿拉善盟': '1529',
      '阿拉善左旗': '152921',
      '阿拉善右旗': '152922',
      '额济纳旗': '152923'
    },
    code: {
      '15': '内蒙古',
      '1501': '呼和浩特市',
      '150101': '呼和浩特市市辖区',
      '150102': '新城区',
      '150103': '回民区',
      '150104': '玉泉区',
      '150105': '赛罕区',
      '150121': '土默特左旗',
      '150122': '托克托县',
      '150123': '和林格尔县',
      '150124': '清水河县',
      '150125': '武川县',
      '1502': '包头市',
      '150201': '包头市市辖区',
      '150202': '东河区',
      '150203': '昆都伦区',
      '150204': '青山区',
      '150205': '石拐矿区',
      '150206': '白云矿区',
      '150207': '九原区',
      '150221': '土默特右旗',
      '150222': '固阳县',
      '150223': '达尔罕茂明安联合旗',
      '1503': '乌海市',
      '150301': '乌海市市辖区',
      '150302': '海勃湾区',
      '150303': '海南区',
      '150304': '乌达区',
      '1504': '赤峰市',
      '150401': '赤峰市市辖区',
      '150402': '红山区',
      '150403': '元宝山区',
      '150404': '松山区',
      '150421': '阿鲁科尔沁旗',
      '150422': '巴林左旗',
      '150423': '巴林右旗',
      '150424': '林西县',
      '150425': '克什克腾旗',
      '150426': '翁牛特旗',
      '150428': '喀喇沁旗',
      '150429': '宁城县',
      '150430': '敖汉旗',
      '1505': '通辽市',
      '150501': '通辽市市辖区: ',
      '150502': '科尔沁区',
      '150521': '科尔沁左翼中旗',
      '150522': '科尔沁左翼后旗',
      '150523': '开鲁县',
      '150524': '库伦旗',
      '150525': '奈曼旗',
      '150526': '扎鲁特旗',
      '150581': '霍林郭勒市',
      '1506': '鄂尔多斯市',
      '150601': '鄂尔多斯市市辖区',
      '150602': '东胜区',
      '150621': '达拉特旗',
      '150622': '准格尔旗',
      '150623': '鄂托克前旗',
      '150624': '鄂托克旗',
      '150625': '杭锦旗',
      '150626': '乌审旗',
      '150627': '伊金霍洛旗',
      '1507': '呼伦贝尔市',
      '150701': '呼伦贝尔市市辖区',
      '150702': '海拉尔区',
      '150721': '阿荣旗',
      '150722': '莫力达瓦达斡尔族自治旗',
      '150723': '鄂伦春自治旗',
      '150724': '鄂温克族自治旗',
      '150725': '陈巴尔虎旗',
      '150726': '新巴尔虎左旗',
      '150727': '新巴尔虎右旗',
      '150781': '满洲里市',
      '150782': '牙克石市',
      '150783': '扎兰屯市',
      '150784': '额尔古纳市',
      '150785': '根河市',
      '1508': '巴彦淖尔市',
      '150801': '巴彦淖尔市市辖区',
      '150802': '临河区',
      '150821': '五原县',
      '150822': '磴口县',
      '150823': '乌拉特前旗',
      '150824': '乌拉特中旗',
      '150825': '乌拉特后旗',
      '150826': '杭锦后旗',
      '1509': '乌兰察布市',
      '150901': '乌兰察布市市辖区',
      '150902': '集宁区',
      '150921': '卓资县',
      '150922': '化德县',
      '150923': '商都县',
      '150924': '兴和县',
      '150925': '凉城县',
      '150926': '察哈尔右翼前旗',
      '150927': '察哈尔右翼中旗',
      '150928': '察哈尔右翼后旗',
      '150929': '四子王旗',
      '150981': '丰镇市',
      '1522': '兴安盟',
      '152201': '乌兰浩特市',
      '152202': '阿尔山市',
      '152221': '科尔沁右翼前旗',
      '152222': '科尔沁右翼中旗',
      '152223': '扎赉特旗',
      '152224': '突泉县',
      '1525': '锡林郭勒盟',
      '152501': '二连浩特市',
      '152502': '锡林浩特市',
      '152522': '阿巴嘎旗',
      '152523': '苏尼特左旗',
      '152524': '苏尼特右旗',
      '152525': '东乌珠穆沁旗',
      '152526': '西乌珠穆沁旗',
      '152527': '太仆寺旗',
      '152528': '镶黄旗',
      '152529': '正镶白旗',
      '152530': '正蓝旗',
      '152531': '多伦县',
      '1529': '阿拉善盟',
      '152921': '阿拉善左旗',
      '152922': '阿拉善右旗',
      '152923': '额济纳旗'
    }
  },
  '21': {
    city: {
      '辽宁': '21',
      '沈阳市': '2101',
      '大连市': '2102',
      '鞍山市': '2103',
      '抚顺市': '2104',
      '本溪市': '2105',
      '丹东市': '2106',
      '锦州市': '2107',
      '营口市': '2108',
      '阜新市': '2109',
      '辽阳市': '2110',
      '盘锦市': '2111',
      '铁岭市': '2112',
      '朝阳市': '2113',
      '葫芦岛市': '2114'
    },
    code: {
      '21': '辽宁',
      '2101': '沈阳市',
      '2102': '大连市',
      '2103': '鞍山市',
      '2104': '抚顺市',
      '2105': '本溪市',
      '2106': '丹东市',
      '2107': '锦州市',
      '2108': '营口市',
      '2109': '阜新市',
      '2110': '辽阳市',
      '2111': '盘锦市',
      '2112': '铁岭市',
      '2113': '朝阳市',
      '2114': '葫芦岛市'
    }
  },
  '22': {
    city: {
      '吉林': '22',
      '长春市': '2201',
      '吉林市': '2202',
      '四平市': '2203',
      '辽源市': '2204',
      '通化市': '2205',
      '白山市': '2206',
      '松原市': '2207',
      '白城市': '2208',
      '延边朝鲜族自治州': '2224'
    },
    code: {
      '22': '吉林',
      '2201': '长春市',
      '2202': '吉林市',
      '2203': '四平市',
      '2204': '辽源市',
      '2205': '通化市',
      '2206': '白山市',
      '2207': '松原市',
      '2208': '白城市',
      '2224': '延边朝鲜族自治州'
    }
  },
  '23': {
    city: {
      '黑龙江': '23',
      '哈尔滨市': '2301',
      '齐齐哈尔市': '2302',
      '鸡西市': '2303',
      '鹤岗市': '2304',
      '双鸭山市': '2305',
      '大庆市': '2306',
      '伊春市': '2307',
      '佳木斯市': '2308',
      '七台河市': '2309',
      '牡丹江市': '2310',
      '黑河市': '2311',
      '绥化市': '2312',
      '大兴安岭地区': '2327'
    },
    code: {
      '23': '黑龙江',
      '2301': '哈尔滨市',
      '2302': '齐齐哈尔市',
      '2303': '鸡西市',
      '2304': '鹤岗市',
      '2305': '双鸭山市',
      '2306': '大庆市',
      '2307': '伊春市',
      '2308': '佳木斯市',
      '2309': '七台河市',
      '2310': '牡丹江市',
      '2311': '黑河市',
      '2312': '绥化市',
      '2327': '大兴安岭地区'
    }
  },
  '31': {
    city: { '上海': '31' },
    code: { '31': '上海' }
  },
  '32': {
    city: {
      '江苏': '32',
      '南京市': '3201',
      '无锡市': '3202',
      '徐州市': '3203',
      '常州市': '3204',
      '苏州市': '3205',
      '南通市': '3206',
      '连云港市': '3207',
      '淮安市': '3208',
      '盐城市': '3209',
      '扬州市': '3210',
      '镇江市': '3211',
      '泰州市': '3212',
      '宿迁市': '3213'
    },
    code: {
      '32': '江苏',
      '3201': '南京市',
      '3202': '无锡市',
      '3203': '徐州市',
      '3204': '常州市',
      '3205': '苏州市',
      '3206': '南通市',
      '3207': '连云港市',
      '3208': '淮安市',
      '3209': '盐城市',
      '3210': '扬州市',
      '3211': '镇江市',
      '3212': '泰州市',
      '3213': '宿迁市'
    }
  },
  '33': {
    city: {
      '浙江': '33',
      '杭州市': '3301',
      '宁波市': '3302',
      '温州市': '3303',
      '嘉兴市': '3304',
      '湖州市': '3305',
      '绍兴市': '3306',
      '金华市': '3307',
      '衢州市': '3308',
      '舟山市': '3309',
      '台州市': '3310',
      '丽水市': '3311'
    },
    code: {
      '33': '浙江',
      '3301': '杭州市',
      '3302': '宁波市',
      '3303': '温州市',
      '3304': '嘉兴市',
      '3305': '湖州市',
      '3306': '绍兴市',
      '3307': '金华市',
      '3308': '衢州市',
      '3309': '舟山市',
      '3310': '台州市',
      '3311': '丽水市'
    }
  },
  '34': {
    city: {
      '安徽': '34',
      '合肥市': '3401',
      '芜湖市': '3402',
      '蚌埠市': '3403',
      '淮南市': '3404',
      '马鞍山市': '3405',
      '淮北市': '3406',
      '铜陵市': '3407',
      '安庆市': '3408',
      '黄山市': '3410',
      '滁州市': '3411',
      '阜阳市': '3412',
      '宿州市': '3422',
      '六安市': '3424',
      '宣城市': '3425',
      '池州市': '3428',
      '亳州市': '3429',
      '瑶海区': '340102',
      '庐阳区': '340103',
      '蜀山区': '340104',
      '包河区': '340111',
      '长丰县': '340121',
      '肥东县': '340122',
      '肥西县': '340123',
      '合肥高新技术产业开发区': '340141',
      '巢湖市': '340192',
      '庐江县': '340193',
      '合肥铁路运输': '340194',
      '镜湖区': '340202',
      '弋江区': '340203',
      '鸠江区': '340205',
      '芜湖县': '340221',
      '繁昌县': '340222',
      '南陵县': '340223',
      '三山区': '340224',
      '芜湖经济技术开发区': '340231',
      '无为县': '340291',
      '龙子湖区': '340302',
      '蚌山区': '340303',
      '禹会区': '340304',
      '淮上区': '340311',
      '怀远县': '340321',
      '五河县': '340322',
      '固镇县': '340323',
      '大通区': '340402',
      '田家庵区': '340403',
      '谢家集区': '340404',
      '八公山区': '340405',
      '潘集区': '340406',
      '凤台县': '340421',
      '博望区': '340502',
      '花山区': '340503',
      '雨山区': '340504',
      '当涂县': '340521',
      '含山县': '340591',
      '和县': '340592',
      '杜集区': '340602',
      '相山区': '340603',
      '烈山区': '340604',
      '濉溪县': '340621',
      '铜官山区': '340702',
      '狮子山区': '340703',
      '郊区': '340711',
      '义安区': '340706',
      '迎江区': '340802',
      '大观区': '340803',
      '宜秀区': '340811',
      '桐城市': '340821',
      '怀宁县': '340822',
      '枞阳县': '340722',
      '潜山县': '340824',
      '太湖县': '340825',
      '宿松县': '340826',
      '望江县': '340827',
      '岳西县': '340828',
      '黄山区': '341001',
      '屯溪区': '341002',
      '徽州区': '341003',
      '歙县': '341021',
      '休宁县': '341022',
      '黟县': '341023',
      '祁门县': '341024',
      '琅琊区': '341101',
      '南谯区': '341103',
      '天长市': '341111',
      '明光市': '341112',
      '来安县': '341121',
      '全椒县': '341122',
      '定远县': '341123',
      '凤阳县': '341124',
      '颍州区': '341203',
      '界首市': '341213',
      '临泉县': '341222',
      '太和县': '341223',
      '阜南县': '341227',
      '颍上县': '341228',
      '颍东区': '341229',
      '颍泉区': '341230',
      '埇桥区': '342201',
      '砀山县': '342221',
      '萧县': '342222',
      '灵璧县': '342224',
      '泗县': '342225',
      '金安区': '342401',
      '寿县': '340422',
      '霍邱县': '342423',
      '舒城县': '342425',
      '金寨县': '342426',
      '霍山县': '342427',
      '裕安区': '342428',
      '叶集改革发展试验区': '342429',
      '宣州区': '342501',
      '郎溪县': '342522',
      '广德县': '342523',
      '宁国市': '342524',
      '绩溪县': '342526',
      '旌德县': '342527',
      '泾县': '342529',
      '贵池区': '342811',
      '东至县': '342821',
      '石台县': '342822',
      '青阳县': '342823',
      '九华山风景区': '342831',
      '谯城区': '342901',
      '涡阳县': '342902',
      '蒙城县': '342903',
      '利辛县': '342904'
    },
    code: {
      '34': '安徽',
      '3401': '合肥市',
      '3402': '芜湖市',
      '3403': '蚌埠市',
      '3404': '淮南市',
      '3405': '马鞍山市',
      '3406': '淮北市',
      '3407': '铜陵市',
      '3408': '安庆市',
      '3410': '黄山市',
      '3411': '滁州市',
      '3412': '阜阳市',
      '3422': '宿州市',
      '3424': '六安市',
      '3425': '宣城市',
      '3428': '池州市',
      '3429': '亳州市',
      '340100': '合肥市',
      '340200': '芜湖市',
      '340300': '蚌埠市',
      '340400': '淮南市',
      '340500': '马鞍山市',
      '340600': '淮北市',
      '340700': '铜陵市',
      '340800': '安庆市',
      '341000': '黄山市',
      '341100': '滁州市',
      '341200': '阜阳市',
      '342200': '宿州市',
      '342400': '六安市',
      '342500': '宣城市',
      '342800': '池州市',
      '342900': '亳州市',
      '340102': '瑶海区',
      '340103': '庐阳区',
      '340104': '蜀山区',
      '340111': '包河区',
      '340121': '长丰县',
      '340122': '肥东县',
      '340123': '肥西县',
      '340141': '合肥高新技术产业开发区',
      '340192': '巢湖市',
      '340193': '庐江县',
      '340194': '合肥铁路运输',
      '340202': '镜湖区',
      '340203': '弋江区',
      '340205': '鸠江区',
      '340221': '芜湖县',
      '340222': '繁昌县',
      '340223': '南陵县',
      '340224': '三山区',
      '340231': '芜湖经济技术开发区',
      '340291': '无为县',
      '340302': '龙子湖区',
      '340303': '蚌山区',
      '340304': '禹会区',
      '340311': '淮上区',
      '340321': '怀远县',
      '340322': '五河县',
      '340323': '固镇县',
      '340402': '大通区',
      '340403': '田家庵区',
      '340404': '谢家集区',
      '340405': '八公山区',
      '340406': '潘集区',
      '340421': '凤台县',
      '340502': '博望区',
      '340503': '花山区',
      '340504': '雨山区',
      '340521': '当涂县',
      '340591': '含山县',
      '340592': '和县',
      '340602': '杜集区',
      '340603': '相山区',
      '340604': '烈山区',
      '340621': '濉溪县',
      '340702': '铜官山区',
      '340703': '狮子山区',
      '340711': '郊区',
      '340706': '义安区',
      '340802': '迎江区',
      '340803': '大观区',
      '340811': '宜秀区',
      '340821': '桐城市',
      '340822': '怀宁县',
      '340722': '枞阳县',
      '340824': '潜山县',
      '340825': '太湖县',
      '340826': '宿松县',
      '340827': '望江县',
      '340828': '岳西县',
      '341001': '黄山区',
      '341002': '屯溪区',
      '341003': '徽州区',
      '341021': '歙县',
      '341022': '休宁县',
      '341023': '黟县',
      '341024': '祁门县',
      '341101': '琅琊区',
      '341103': '南谯区',
      '341111': '天长市',
      '341112': '明光市',
      '341121': '来安县',
      '341122': '全椒县',
      '341123': '定远县',
      '341124': '凤阳县',
      '341203': '颍州区',
      '341213': '界首市',
      '341222': '临泉县',
      '341223': '太和县',
      '341227': '阜南县',
      '341228': '颍上县',
      '341229': '颍东区',
      '341230': '颍泉区',
      '342201': '埇桥区',
      '342221': '砀山县',
      '342222': '萧县',
      '342224': '灵璧县',
      '342225': '泗县',
      '342401': '金安区',
      '340422': '寿县',
      '342423': '霍邱县',
      '342425': '舒城县',
      '342426': '金寨县',
      '342427': '霍山县',
      '342428': '裕安区',
      '342429': '叶集改革发展试验区',
      '342501': '宣州区',
      '342522': '郎溪县',
      '342523': '广德县',
      '342524': '宁国市',
      '342526': '绩溪县',
      '342527': '旌德县',
      '342529': '泾县',
      '342811': '贵池区',
      '342821': '东至县',
      '342822': '石台县',
      '342823': '青阳县',
      '342831': '九华山风景区',
      '342901': '谯城区',
      '342902': '涡阳县',
      '342903': '蒙城县',
      '342904': '利辛县'
    }
  },
  '35': {
    city: {
      '福建': '35',
      '福州市': '3501',
      '厦门市': '3502',
      '莆田市': '3503',
      '三明市': '3504',
      '泉州市': '3505',
      '漳州市': '3506',
      '南平市': '3507',
      '龙岩市': '3508',
      '宁德市': '3509'
    },
    code: {
      '35': '福建',
      '3501': '福州市',
      '3502': '厦门市',
      '3503': '莆田市',
      '3504': '三明市',
      '3505': '泉州市',
      '3506': '漳州市',
      '3507': '南平市',
      '3508': '龙岩市',
      '3509': '宁德市'
    }
  },
  '36': {
    city: {
      '江西': '36',
      '南昌市': '3601',
      '景德镇市': '3602',
      '萍乡市': '3603',
      '九江市': '3604',
      '新余市': '3605',
      '鹰潭市': '3606',
      '赣州市': '3607',
      '吉安市': '3608',
      '宜春市': '3609',
      '抚州市': '3610',
      '上饶市': '3611'
    },
    code: {
      '36': '江西',
      '3601': '南昌市',
      '3602': '景德镇市',
      '3603': '萍乡市',
      '3604': '九江市',
      '3605': '新余市',
      '3606': '鹰潭市',
      '3607': '赣州市',
      '3608': '吉安市',
      '3609': '宜春市',
      '3610': '抚州市',
      '3611': '上饶市'
    }
  },
  '41': {
    city: {
      '河南': '41',
      '郑州市': '4101',
      '开封市': '4102',
      '洛阳市': '4103',
      '平顶山市': '4104',
      '安阳市': '4105',
      '鹤壁市': '4106',
      '新乡市': '4107',
      '焦作市': '4108',
      '濮阳市': '4109',
      '许昌市': '4110',
      '漯河市': '4111',
      '三门峡市': '4112',
      '南阳市': '4113',
      '商丘市': '4114',
      '信阳市': '4115',
      '周口市': '4116',
      '驻马店市': '4117',
      '红旗区': '410702',
      '卫滨区': '410703',
      '凤泉区': '410704',
      '牧野区': '410711',
      '新乡县': '410721',
      '获嘉县': '410724',
      '原阳县': '410725',
      '延津县': '410726',
      '封丘县': '410727',
      '长垣县': '410728',
      '卫辉市': '410781',
      '辉县市': '410782'
    },
    code: {
      '41': '河南',
      '4101': '郑州市',
      '4102': '开封市',
      '4103': '洛阳市',
      '4104': '平顶山市',
      '4105': '安阳市',
      '4106': '鹤壁市',
      '4107': '新乡市',
      '4108': '焦作市',
      '4109': '濮阳市',
      '4110': '许昌市',
      '4111': '漯河市',
      '4112': '三门峡市',
      '4113': '南阳市',
      '4114': '商丘市',
      '4115': '信阳市',
      '4116': '周口市',
      '4117': '驻马店市',
      '410702': '红旗区',
      '410703': '卫滨区',
      '410704': '凤泉区',
      '410711': '牧野区',
      '410721': '新乡县',
      '410724': '获嘉县',
      '410725': '原阳县',
      '410726': '延津县',
      '410727': '封丘县',
      '410728': '长垣县',
      '410781': '卫辉市',
      '410782': '辉县市'
    }
  },
  '42': {
    city: {
      '湖北': '42',
      '黄石市': '4202',
      '十堰市': '4203',
      '宜昌市': '4205',
      '襄阳市': '4206',
      '鄂州市': '4207',
      '荆门市': '4208',
      '孝感市': '4209',
      '荆州市': '4210',
      '黄冈市': '4211',
      '咸宁市': '4212',
      '随州市': '4213',
      '恩施土家族苗族自治州': '4228',
      '武汉市': '4201',
      '江岸区': '420102',
      '江汉区': '420103',
      '硚口区': '420104',
      '汉阳区': '420105',
      '武昌区': '420106',
      '青山区': '420107',
      '洪山区': '420111',
      '东西湖区': '420112',
      '汉南区': '420113',
      '蔡甸区': '420114',
      '江夏区': '420115',
      '黄陂区': '420116',
      '新洲区': '420117',
      '东湖高新开发区': '420140',
      '经济开发区': '420141',
      '黄石港区': '420202',
      '西塞山区': '420203',
      '下陆区': '420204',
      '铁山区': '420205',
      '阳新县': '420222',
      '大冶市': '420281',
      '茅箭区': '420302',
      '张湾区': '420303',
      '郧县': '420321',
      '郧西县': '420322',
      '竹山县': '420323',
      '竹溪县': '420324',
      '房县': '420325',
      '武当山特区': '420340',
      '丹江口市': '420381',
      '西陵区': '420502',
      '伍家岗区': '420503',
      '点军区': '420504',
      '猇亭区': '420505',
      '夷陵区': '420506',
      '远安县': '420525',
      '兴山县': '420526',
      '秭归县': '420527',
      '长阳土家族自治县': '420528',
      '五峰土家族自治县': '420529',
      '开发区': '420540',
      '宜都市': '420581',
      '当阳市': '420582',
      '枝江市': '420583',
      '襄城区': '420602',
      '樊城区': '420606',
      '襄州区': '420607',
      '南漳县': '420624',
      '谷城县': '420625',
      '保康县': '420626',
      '高新技术开发区': '420640',
      '老河口市': '420682',
      '枣阳市': '420683',
      '宜城市': '420684',
      '梁子湖区': '420702',
      '华容区': '420703',
      '鄂城区': '420704',
      '东宝区': '420802',
      '掇刀区': '420804',
      '京山县': '420821',
      '沙洋县': '420822',
      '钟祥市': '420881',
      '孝南区': '420902',
      '孝昌县': '420921',
      '大悟县': '420922',
      '云梦县': '420923',
      '应城市': '420981',
      '安陆市': '420982',
      '汉川市': '420984',
      '沙市区': '421002',
      '荆州区': '421003',
      '公安县': '421022',
      '监利县': '421023',
      '江陵县': '421024',
      '石首市': '421081',
      '洪湖市': '421083',
      '松滋市': '421087',
      '黄州区': '421102',
      '团风县': '421121',
      '红安县': '421122',
      '罗田县': '421123',
      '英山县': '421124',
      '浠水县': '421125',
      '蕲春县': '421126',
      '黄梅县': '421127',
      '麻城市': '421181',
      '武穴市': '421182',
      '咸安区': '421202',
      '嘉鱼县': '421221',
      '通城县': '421222',
      '崇阳县': '421223',
      '通山县': '421224',
      '赤壁市': '421281',
      '曾都区': '421302',
      '随县': '421321',
      '广水市': '421381',
      '恩施市': '422801',
      '利川市': '422802',
      '建始县': '422822',
      '巴东县': '422823',
      '宣恩县': '422825',
      '咸丰县': '422826',
      '来凤县': '422827',
      '鹤峰县': '422828',
      '仙桃市': '429004',
      '潜江市': '429005',
      '天门市': '429006',
      '神农架': '429021'
    },
    code: {
      '42': '湖北',
      '4201': '武汉市',
      '4202': '黄石市',
      '4203': '十堰市',
      '4205': '宜昌市',
      '4206': '襄阳市',
      '4207': '鄂州市',
      '4208': '荆门市',
      '4209': '孝感市',
      '4210': '荆州市',
      '4211': '黄冈市',
      '4212': '咸宁市',
      '4213': '随州市',
      '4228': '恩施土家族苗族自治州',
      '420102': '江岸区',
      '420103': '江汉区',
      '420104': '硚口区',
      '420105': '汉阳区',
      '420106': '武昌区',
      '420107': '青山区',
      '420111': '洪山区',
      '420112': '东西湖区',
      '420113': '汉南区',
      '420114': '蔡甸区',
      '420115': '江夏区',
      '420116': '黄陂区',
      '420117': '新洲区',
      '420140': '东湖高新开发区',
      '420141': '经济开发区',
      '420202': '黄石港区',
      '420203': '西塞山区',
      '420204': '下陆区',
      '420205': '铁山区',
      '420222': '阳新县',
      '420281': '大冶市',
      '420302': '茅箭区',
      '420303': '张湾区',
      '420321': '郧县',
      '420322': '郧西县',
      '420323': '竹山县',
      '420324': '竹溪县',
      '420325': '房县',
      '420340': '武当山特区',
      '420381': '丹江口市',
      '420502': '西陵区',
      '420503': '伍家岗区',
      '420504': '点军区',
      '420505': '猇亭区',
      '420506': '夷陵区',
      '420525': '远安县',
      '420526': '兴山县',
      '420527': '秭归县',
      '420528': '长阳土家族自治县',
      '420529': '五峰土家族自治县',
      '420540': '开发区',
      '420581': '宜都市',
      '420582': '当阳市',
      '420583': '枝江市',
      '420602': '襄城区',
      '420606': '樊城区',
      '420607': '襄州区',
      '420624': '南漳县',
      '420625': '谷城县',
      '420626': '保康县',
      '420640': '高新技术开发区',
      '420682': '老河口市',
      '420683': '枣阳市',
      '420684': '宜城市',
      '420702': '梁子湖区',
      '420703': '华容区',
      '420704': '鄂城区',
      '420802': '东宝区',
      '420804': '掇刀区',
      '420821': '京山县',
      '420822': '沙洋县',
      '420881': '钟祥市',
      '420902': '孝南区',
      '420921': '孝昌县',
      '420922': '大悟县',
      '420923': '云梦县',
      '420981': '应城市',
      '420982': '安陆市',
      '420984': '汉川市',
      '421002': '沙市区',
      '421003': '荆州区',
      '421022': '公安县',
      '421023': '监利县',
      '421024': '江陵县',
      '421081': '石首市',
      '421083': '洪湖市',
      '421087': '松滋市',
      '421102': '黄州区',
      '421121': '团风县',
      '421122': '红安县',
      '421123': '罗田县',
      '421124': '英山县',
      '421125': '浠水县',
      '421126': '蕲春县',
      '421127': '黄梅县',
      '421181': '麻城市',
      '421182': '武穴市',
      '421202': '咸安区',
      '421221': '嘉鱼县',
      '421222': '通城县',
      '421223': '崇阳县',
      '421224': '通山县',
      '421281': '赤壁市',
      '421302': '曾都区',
      '421321': '随县',
      '421381': '广水市',
      '422801': '恩施市',
      '422802': '利川市',
      '422822': '建始县',
      '422823': '巴东县',
      '422825': '宣恩县',
      '422826': '咸丰县',
      '422827': '来凤县',
      '422828': '鹤峰县',
      '429004': '仙桃市',
      '429005': '潜江市',
      '429006': '天门市',
      '429021': '神农架'
    }
  }
}
export default codeMap