import store from '@/store'
import CryptoJS from 'crypto-js'
export function handleRemove(file, fileList) {
}
export function getProductName() {
  return window.config.systemKey
}
export function changeSystem(key) {
  this.showProject = false
  window.config.systemKey = key
  store.dispatch('Reset')
  location.assign(this.projects[key].url)
}
export function showNext(form, stepName, step) {
  this.$refs[form].validate((valid) => {
    if (valid) {
      this[stepName] = step
    } else {
      return false
    }
  })
}
export function showPrev(stepName, step) {
  this[stepName] = step
}
export function getCourt() {
  return this.$store.getters.court || []
}
export function getAllCourt() {
  return this.$store.getters.allCourt || []
}
export function getOwnersFiles(ownerId, key) {
  this.fd.req({
    type: 'get',
    url: 'api/attachments/owners/' + ownerId
  }, 'basic_url').then(response => {
    this.$set(this, key, response.data)
  }).catch(error => {
    console.log('getOwnersFiles', error)
  })
}
export function goBack() {
  this.$router.back(-1)
}
export function resetForm(formName) {
  this.$nextTick(() => {
    this.$refs[formName].resetFields()
  })
}
export function decrypt(word) {
  const key = 'future-data.comx' // 与后台一样  密码
  const iv = '0123456789abcdef' // 与后台一样
  const obj = CryptoJS.AES.encrypt(word, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  })
  return obj.toString()
}
