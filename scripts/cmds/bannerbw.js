this.config = {    
  name: "bannerbw",
  version: "1.0.1",
  author: {
    name: "NTKhang", 
    contacts: ""
  },
  cooldowns: 5,
  role: 0,
  shortDescription: "Tạo banner dịch vụ online",
  longDescription: "Tạo ảnh bìa hỗ trợ dịch vụ online phong cách trắng đen",
  category: "image",
  guide: "{prefix}bannerbw <name> | <titlefacebook> | <facebook> | <phone> | <mail> | <location> | [<link ảnh> | hoặc reply hình ảnh]"
};

module.exports = {
  config: this.config,
  start: async function({ api, message, event, args, help }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const qs = require("querystring");
    
    const content = args.join(" ").trim().replace(/\s+/g, " ").replace(/(\s+\|)/g, "|").replace(/\|\s+/g,  "|").split("|");
    const name      = content[0],
    titlefacebook   = content[1],
    facebook        = content[2],
    phone           = content[3],
    mail            = content[4],
    location        = content[5],
    avatarurl         = event.messageReply ? ((event.messageReply.attachments.length > 0) ? event.messageReply.attachments[0].url : content[6]) : content[6];
    if (!avatarurl || !avatarurl.includes("http")) return message.reply(`Vui lòng nhập link hình ảnh hợp lệ, sử dụng help ${this.config.name} để xem chi tiết cách sử dụng lệnh`);
    let params = { name, titlefacebook, facebook, phone, mail, location, avatarurl, apikey: "ntkhang" };
    for (let i in params) if (!params[i]) return message.SyntaxError();
    params = qs.stringify(params);
    message.reply(`Đang khởi tạo hình ảnh, vui lòng chờ đợi...`);
    const pathsave = __dirname + `/cache/bannerbw${Date.now()}.jpg`;
    
    axios.get("https://goatbot.tk/taoanhdep/banner-black-white?"+params, {
      responseType: "arraybuffer"
    })
    .then(data => {
      const imageBuffer = data.data;
      fs.writeFileSync(pathsave, Buffer.from(imageBuffer));
      message.reply({ attachment: fs.createReadStream(pathsave) }, () => fs.unlinkSync(pathsave));
    })
    .catch(error => {
      let err;
      if (error.response) err = JSON.parse(error.response.data.toString());
      else err = error;
      return message.reply(`Đã xảy ra lỗi ${err.error} ${err.message}`);
    });
  }
};