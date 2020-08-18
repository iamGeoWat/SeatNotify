const axios = require('axios')
const fs = require('fs')

setInterval(()=>{
  axios.get('https://ielts.neea.cn/checkImage?_=1596770276339&2a9lhcMh=51EhmhyKrQodQcObUIhNlwrT4HmVv.T2jUzYFuT8qM_tzhNBXtPAJyMV2M3cNtErdm6dSQrDXZk3Ugv4vWyVZm7mauTG06jCX_glTD5PB4WcQyyAMWpZL_I9f7Q1lLgDM1Z85h7N_Y_YunfZqfY5zbkjGmFnIDgIT4H5q8R2pn3b9n8AF24HCNtCe4wVlYH2A91UaHytVPu.Yr03eyGFTMQ12PPEKYzuj9qxz2Xd_fMUueVnHwPfzAEoOzDXdFerq5aDMPgJjPoxTNXilWhYy0irwBbttqGQGQ_IF.wyt7vmHlv.1ZQXNYgbtwygK_HgLlhhUFO3ZqELLc.ihFA94KZ1nsE547kZ8PKhTcBxzoD0pRqN1G2tawdpL5nL_mDJswoAROsS6YVkTNfEszhCff_RJfrhwRlZH_LPnpGsMaupk4uTnlvwxs3.aKJJvJu14Igp').then(
    (res)=> {
      // console.log(res.data.chkImgFilename)
      fs.writeFile('./res.txt', res.data.chkImgFilename+'\n', {flag: 'a', encoding: 'utf-8'}, ()=>{console.log('write: ', res.data.chkImgFilename)})
    }
  )
}, 600)