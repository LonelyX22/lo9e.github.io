(() => {
  const KEY = 'boatFlasherLanguage';
  const words = {
    th: {
      navHome:'หน้า Home', navFlash:'Flash Firmware', navWifi:'ควบคุมเรือผ่าน Wi-Fi',
      navFaq:'FAQ / แก้ไขปัญหา', navContact:'ติดต่อผู้พัฒนา', navCta:'เริ่มแฟลชเลย',
      navBrandSub:'SMART TRASH COLLECTION BOAT', navGithub:'GitHub',
      homeEyebrow:'/// SMART TRASH COLLECTION BOAT',
      homeTitle1:'เรือเก็บขยะ', homeTitle2:'ควบคุมง่ายผ่าน Wi-Fi',
      homeLead:'ศูนย์รวมคู่มือและเครื่องมือสำหรับเรือเก็บขยะควบคุมระยะไกล ตั้งแต่ติดตั้งเฟิร์มแวร์ เชื่อมต่อ Wi-Fi ไปจนถึงการควบคุมเรือผ่านมือถือหรือคอมพิวเตอร์',
      homeFlashBtn:'ไปหน้า Flash Firmware', homeWifiBtn:'ดูวิธีควบคุมเรือ',
      homeArtTop:'ระบบควบคุมเรือ / ออนไลน์', homeArtBottom:'ESP32  ·  WIFI  ·  DUAL MOTOR',
      homeStat1:'บอร์ดที่รองรับ', homeStat1Value:'ESP32 / C5', homeStat2:'ระบบขับเคลื่อน', homeStat2Value:'L298N + 12V × 2', homeStat3:'ช่องทางควบคุม', homeStat3Value:'WI-FI WEB CONTROL',
      homeSectionEyebrow:'START HERE / 01', homeSectionTitle:'เริ่มต้นใช้งานใน 3 ขั้นตอน',
      homeStep1Title:'ติดตั้ง Firmware', homeStep1Text:'เลือกบอร์ดให้ตรงรุ่น เชื่อมต่อ USB และแฟลชเฟิร์มแวร์ผ่านเบราว์เซอร์',
      homeStep2Title:'เชื่อมต่อ Wi-Fi', homeStep2Text:'เปิดเรือ แล้วเชื่อมต่อโทรศัพท์หรือคอมพิวเตอร์เข้ากับเครือข่าย Wi-Fi ของบอร์ด',
      homeStep3Title:'ควบคุมเรือ', homeStep3Text:'เปิดหน้า Control ผ่าน IP ของบอร์ด กดเปิดระบบควบคุม แล้วใช้จอยสติ๊กสั่งทิศทาง',
      homeFeatureEyebrow:'SYSTEM FEATURES / 02', homeFeatureTitle:'ออกแบบให้เริ่มทำตามได้',
      homeFeature1Title:'แฟลชผ่านเว็บ', homeFeature1Text:'ใช้ Chrome หรือ Edge บนคอมพิวเตอร์ แฟลชไฟล์ .bin ผ่าน USB ได้โดยไม่ต้องติดตั้งโปรแกรมแฟลชแยก',
      homeFeature2Title:'ควบคุมผ่าน Wi-Fi', homeFeature2Text:'บอร์ดสร้างเครือข่าย Wi-Fi ของตัวเอง แล้วเปิดหน้าเว็บควบคุมจากอุปกรณ์ที่เชื่อมต่อ',
      homeFeature3Title:'ระบบหยุดเพื่อความปลอดภัย', homeFeature3Text:'เฟิร์มแวร์ ESP32-C5 รุ่นที่ใช้ระบบ failsafe จะสั่งหยุดมอเตอร์เมื่อขาดคำสั่งควบคุมตามเวลาที่กำหนด',
      homeFooterNote:'โครงงานเรือเก็บขยะควบคุมผ่าน Wi-Fi', homeFooterTag:'BUILT TO MAKE CLEANER WATERWAYS',
      wifiEyebrow:'/// WIRELESS CONTROL GUIDE', wifiTitle1:'ควบคุมเรือ', wifiTitle2:'ผ่าน Wi-Fi',
      wifiLead:'ทำตามขั้นตอนด้านล่างเพื่อเชื่อมต่อกับบอร์ด ESP32-C5 และเปิดหน้าเว็บควบคุมเรือจากโทรศัพท์หรือคอมพิวเตอร์',
      wifiWarningTitle:'ก่อนเริ่มใช้งาน', wifiWarningText:'ทดสอบบนพื้นแห้งก่อนลงน้ำ ยกใบพัดหรือส่วนที่หมุนให้พ้นสิ่งกีดขวาง และเตรียมปุ่มหยุดฉุกเฉินไว้เสมอ',
      wifiConfigTitle:'ค่าการเชื่อมต่อเริ่มต้นของเฟิร์มแวร์ ESP32-C5', wifiSSID:'ชื่อเครือข่าย (SSID)', wifiPassword:'รหัสผ่าน Wi-Fi', wifiAddress:'ที่อยู่หน้าเว็บควบคุม', wifiConfigNote:'ค่าด้านบนอ้างอิงจากเฟิร์มแวร์ ESP32-C5 ที่จัดเตรียมไว้ หากใช้บอร์ดหรือเฟิร์มแวร์คนละรุ่น ชื่อ Wi-Fi และรหัสผ่านอาจแตกต่างกัน',
      wifiStepsEyebrow:'CONNECTION / 01', wifiStepsTitle:'วิธีเชื่อมต่อและควบคุม',
      wifiStep1Title:'เปิดระบบเรือ', wifiStep1Text:'จ่ายไฟให้บอร์ด ESP32 และชุดขับมอเตอร์ รอให้บอร์ดเริ่มกระจายสัญญาณ Wi-Fi',
      wifiStep2Title:'เชื่อมต่อเครือข่าย', wifiStep2Text:'เปิด Wi-Fi บนมือถือหรือคอมพิวเตอร์ เลือก BOAT-RC-C5 แล้วใส่รหัสผ่านตามที่แสดงด้านบน หากมีข้อความว่าไม่มีอินเทอร์เน็ต ให้เลือกเชื่อมต่อค้างไว้',
      wifiStep3Title:'เปิดหน้า Control', wifiStep3Text:'เปิดเบราว์เซอร์และพิมพ์ http://192.168.4.1 ในแถบที่อยู่ ต้องเชื่อมต่อกับ Wi-Fi ของเรืออยู่ก่อน',
      wifiStep4Title:'เริ่มควบคุมเรือ', wifiStep4Text:'ตรวจพื้นที่รอบเรือให้ปลอดภัย กด ENABLE หรือ ARM เพื่อเปิดระบบ จากนั้นใช้จอยสติ๊กบนหน้าจอเพื่อเดินหน้า ถอยหลัง และเลี้ยว กด STOP เมื่อหยุดใช้งาน',
      wifiSafetyTitle:'ระบบ Failsafe ของเฟิร์มแวร์ C5', wifiSafetyText:'เฟิร์มแวร์ C5 ที่อ้างอิงในคู่มือนี้ส่งสัญญาณ heartbeat ทุก 200 มิลลิวินาที และตั้งเวลาหยุดมอเตอร์เมื่อไม่มีคำสั่งเกินประมาณ 900 มิลลิวินาที อย่างไรก็ตามควรเตรียมวิธีตัดไฟมอเตอร์จริงไว้ด้วย',
      wifiFooterNote:'คู่มือการควบคุมเรือผ่าน Wi-Fi', wifiFooterTag:'CHECK YOUR BOARD CONFIG BEFORE USE',
      faqEyebrow:'/// SUPPORT CENTER', faqTitle1:'FAQ &', faqTitle2:'แก้ไขปัญหา',
      faqLead:'รวมคำถามที่พบบ่อยเกี่ยวกับการแฟลชเฟิร์มแวร์ การเชื่อมต่อ Wi-Fi และการควบคุมเรือ',
      faqQ1:'หน้า Flash Firmware ไม่พบพอร์ต USB ต้องทำอย่างไร?', faqA1:'ใช้ Chrome หรือ Microsoft Edge บนคอมพิวเตอร์ ตรวจสอบว่าสาย USB รองรับการรับส่งข้อมูล ไม่ใช่สายชาร์จอย่างเดียว แล้วถอดเสียบใหม่ หากยังไม่พบ ให้ตรวจไดรเวอร์ USB-to-Serial และลองกดปุ่ม BOOT ขณะเชื่อมต่อบอร์ด',
      faqQ2:'กดเชื่อมต่อแล้วแฟลชไม่สำเร็จ?', faqA2:'ตรวจสอบว่าเลือกชนิดบอร์ดตรงกับอุปกรณ์ ใช้ไฟล์เฟิร์มแวร์ของบอร์ดรุ่นนั้น และอย่าถอดสาย USB ระหว่างเขียนข้อมูล หากยังล้มเหลว ให้เชื่อมต่อใหม่ในโหมด Bootloader แล้วลองอีกครั้ง',
      faqQ3:'ไม่เห็นชื่อ Wi-Fi ของเรือ?', faqA3:'ตรวจสอบไฟเลี้ยงบอร์ดและรอหลังเปิดระบบสักครู่ จากนั้นปิดและเปิด Wi-Fi บนอุปกรณ์อีกครั้ง หากยังไม่พบ ให้รีเซ็ตบอร์ดและตรวจว่าแฟลชเฟิร์มแวร์ที่เปิดใช้งาน Access Point แล้ว',
      faqQ4:'เชื่อมต่อ Wi-Fi ได้ แต่หน้าเว็บเปิดไม่ได้?', faqA4:'ตรวจสอบว่าโทรศัพท์ยังเชื่อมต่อกับ Wi-Fi ของเรืออยู่ แล้วพิมพ์ IP ในแถบที่อยู่โดยตรง เช่น http://192.168.4.1 สำหรับเฟิร์มแวร์ ESP32-C5 ที่ใช้ค่าเริ่มต้นนี้',
      faqQ5:'เปิดหน้าเว็บแล้ว แต่มอเตอร์ไม่หมุน?', faqA5:'ตรวจว่ากด ENABLE หรือ ARM แล้วหรือยัง ตรวจไฟเลี้ยงมอเตอร์ 12V สายสัญญาณระหว่าง ESP32 กับ L298N และการต่อขั้วมอเตอร์ ทดสอบโดยยกใบพัดให้พ้นพื้นและอย่าแตะส่วนที่หมุน',
      faqQ6:'มอเตอร์หยุดเองเมื่อ Wi-Fi หลุด เป็นเพราะอะไร?', faqA6:'เฟิร์มแวร์ ESP32-C5 ที่ใช้ระบบ failsafe จะหยุดมอเตอร์เมื่อไม่ได้รับคำสั่งควบคุมตามเวลาที่กำหนด เป็นระบบป้องกันเมื่อสัญญาณขาด หากต้องการใช้งานต่อ ให้เชื่อมต่อใหม่และเปิดระบบควบคุมอีกครั้ง',
      faqQ7:'มอเตอร์หมุนกลับทิศ ต้องแก้อย่างไร?', faqA7:'ตรวจสอบการต่อสายมอเตอร์ซ้ายและขวา หรือปรับค่าตัวแปร INVERT_LEFT_MOTOR / INVERT_RIGHT_MOTOR ในโค้ดให้ตรงกับทิศทางการติดตั้ง แล้วคอมไพล์และแฟลชใหม่',
      faqNoteTitle:'ยังแก้ปัญหาไม่ได้?', faqNoteText:'รวบรวมรุ่นบอร์ด เวอร์ชัน Firmware และข้อความ Error แล้วส่งรายละเอียดให้ผู้พัฒนาผ่าน GitHub Issues', faqFooterNote:'คำถามที่พบบ่อยและการแก้ไขปัญหา', faqFooterTag:'IF IT PERSISTS, OPEN A GITHUB ISSUE',
      contactEyebrow:'/// DEVELOPER SUPPORT', contactTitle1:'ติดต่อ', contactTitle2:'ผู้พัฒนา',
      contactLead:'พบข้อผิดพลาด มีข้อเสนอแนะ หรือต้องการช่วยพัฒนาโครงงาน สามารถเปิดประเด็นผ่าน GitHub เพื่อให้ตรวจสอบและติดตามการแก้ไขได้',
      contactRepoTitle:'SOURCE CODE', contactRepoText:'ดูซอร์สโค้ด เว็บไซต์ และไฟล์ที่เกี่ยวข้องกับโครงงานบน GitHub',
      contactIssueTitle:'REPORT A PROBLEM', contactIssueText:'แจ้งปัญหา บอกขั้นตอนที่ทำให้เกิดข้อผิดพลาด และแนบภาพหน้าจอหรือ Serial Log เพื่อช่วยวิเคราะห์',
      contactTemplateTitle:'ข้อมูลที่ควรแนบเมื่อแจ้งปัญหา', contactTemplateText:'คัดลอกแบบฟอร์มด้านล่างไปกรอกใน GitHub Issue เพื่อให้ตรวจสอบได้รวดเร็วขึ้น',
      contactCopy:'คัดลอกข้อความ', contactCopied:'คัดลอกแล้ว', contactChecklist:'บอร์ดที่ใช้:\\nเวอร์ชัน Firmware:\\nอุปกรณ์ที่ใช้ควบคุม:\\nเบราว์เซอร์:\\nอาการที่พบ:\\nขั้นตอนที่ทำให้เกิดปัญหา:\\nข้อความ Error / Serial Log:',
      contactFooterNote:'ช่องทางติดต่อและแจ้งปัญหา', contactFooterTag:'THANKS FOR HELPING IMPROVE THE PROJECT'
    },
    en: {
      navHome:'Home', navFlash:'Flash Firmware', navWifi:'Wi-Fi Boat Control',
      navFaq:'FAQ / Troubleshooting', navContact:'Contact Developer', navCta:'FLASH NOW',
      navBrandSub:'SMART TRASH COLLECTION BOAT', navGithub:'GitHub',
      homeEyebrow:'/// SMART TRASH COLLECTION BOAT',
      homeTitle1:'SMART CLEANUP BOAT', homeTitle2:'CONTROLLED OVER WI-FI',
      homeLead:'A central hub for the remote-controlled trash collection boat: install firmware, connect over Wi-Fi, and control the boat from a phone or computer.',
      homeFlashBtn:'Open Flash Firmware', homeWifiBtn:'Read Control Guide',
      homeArtTop:'BOAT CONTROL SYSTEM / ONLINE', homeArtBottom:'ESP32  ·  WIFI  ·  DUAL MOTOR',
      homeStat1:'SUPPORTED BOARDS', homeStat1Value:'ESP32 / C5', homeStat2:'DRIVE SYSTEM', homeStat2Value:'L298N + 12V × 2', homeStat3:'CONTROL METHOD', homeStat3Value:'WI-FI WEB CONTROL',
      homeSectionEyebrow:'START HERE / 01', homeSectionTitle:'Get started in 3 steps',
      homeStep1Title:'Install firmware', homeStep1Text:'Choose the correct board, connect USB, and flash the firmware through your browser.',
      homeStep2Title:'Connect to Wi-Fi', homeStep2Text:'Power on the boat, then connect your phone or computer to the board Wi-Fi network.',
      homeStep3Title:'Control the boat', homeStep3Text:'Open the control page using the board IP, enable the control system, and use the on-screen joystick.',
      homeFeatureEyebrow:'SYSTEM FEATURES / 02', homeFeatureTitle:'Built to be easy to follow',
      homeFeature1Title:'Browser-based flashing', homeFeature1Text:'Use Chrome or Edge on a computer to flash a .bin file over USB without a separate desktop flasher.',
      homeFeature2Title:'Wi-Fi control', homeFeature2Text:'The board creates its own Wi-Fi network and hosts the control page for connected devices.',
      homeFeature3Title:'Safety failsafe', homeFeature3Text:'ESP32-C5 firmware builds with failsafe enabled stop the motors when control commands time out.',
      homeFooterNote:'Wi-Fi controlled trash collection boat project', homeFooterTag:'BUILT TO MAKE CLEANER WATERWAYS',
      wifiEyebrow:'/// WIRELESS CONTROL GUIDE', wifiTitle1:'CONTROL YOUR BOAT', wifiTitle2:'OVER WI-FI',
      wifiLead:'Follow these steps to connect to the ESP32-C5 board and open the boat control page from a phone or computer.',
      wifiWarningTitle:'Before you begin', wifiWarningText:'Test on dry land before entering water. Keep propellers and moving parts clear, and always have a way to cut motor power.',
      wifiConfigTitle:'Default connection settings for ESP32-C5 firmware', wifiSSID:'Wi-Fi network (SSID)', wifiPassword:'Wi-Fi password', wifiAddress:'Control page address', wifiConfigNote:'These values are from the supplied ESP32-C5 firmware. Other boards or firmware builds may use a different network name or password.',
      wifiStepsEyebrow:'CONNECTION / 01', wifiStepsTitle:'Connect and control',
      wifiStep1Title:'Power on the boat', wifiStep1Text:'Power the ESP32 board and motor driver. Wait for the board to start its Wi-Fi access point.',
      wifiStep2Title:'Join the network', wifiStep2Text:'Open Wi-Fi settings and connect to BOAT-RC-C5 using the password shown above. If your device says there is no internet, choose to stay connected.',
      wifiStep3Title:'Open the control page', wifiStep3Text:'Open a browser and enter http://192.168.4.1 in the address bar. Your device must be connected to the boat Wi-Fi first.',
      wifiStep4Title:'Start controlling', wifiStep4Text:'Check that the area around the boat is clear. Press ENABLE or ARM, then use the on-screen joystick to move and steer. Press STOP when finished.',
      wifiSafetyTitle:'C5 firmware failsafe', wifiSafetyText:'The C5 firmware referenced here sends a heartbeat every 200 ms and stops the motors if no command arrives for about 900 ms. Keep a physical way to disconnect motor power as well.',
      wifiFooterNote:'Wi-Fi boat control guide', wifiFooterTag:'CHECK YOUR BOARD CONFIG BEFORE USE',
      faqEyebrow:'/// SUPPORT CENTER', faqTitle1:'FAQ &', faqTitle2:'TROUBLESHOOTING',
      faqLead:'Answers to common questions about firmware flashing, Wi-Fi connection, and boat control.',
      faqQ1:'The Flash Firmware page cannot find my USB port. What should I do?', faqA1:'Use Chrome or Microsoft Edge on a computer. Make sure the USB cable supports data, not charging only, then reconnect the board. If it still does not appear, check the USB-to-Serial driver and try holding BOOT while connecting.',
      faqQ2:'The connection starts but flashing fails.', faqA2:'Confirm that the selected board matches your device and that the firmware image is for that board. Do not unplug USB while writing. If it still fails, reconnect in bootloader mode and retry.',
      faqQ3:'I cannot see the boat Wi-Fi network.', faqA3:'Check the board power and wait briefly after startup. Toggle Wi-Fi on your device. If the network is still missing, reset the board and confirm that firmware with Access Point support is installed.',
      faqQ4:'I am connected to Wi-Fi, but the control page will not open.', faqA4:'Make sure your device is still connected to the boat network, then enter the IP address directly, for example http://192.168.4.1 for the supplied ESP32-C5 default configuration.',
      faqQ5:'The page opens, but the motors do not move.', faqA5:'Check whether ENABLE or ARM has been pressed. Verify the 12V motor supply, signal wiring between ESP32 and L298N, and motor connections. Test with propellers clear and keep hands away from moving parts.',
      faqQ6:'The motors stop when Wi-Fi disconnects. Why?', faqA6:'The ESP32-C5 firmware with failsafe stops the motors when control commands are not received within the configured timeout. Reconnect and enable the control system again before continuing.',
      faqQ7:'The motors rotate in the wrong direction. How can I fix this?', faqA7:'Check the left and right motor wiring or adjust INVERT_LEFT_MOTOR / INVERT_RIGHT_MOTOR in the code to match the installation, then compile and flash again.',
      faqNoteTitle:'Still need help?', faqNoteText:'Collect your board model, firmware version, and error message, then send the details through GitHub Issues.', faqFooterNote:'Frequently asked questions and troubleshooting', faqFooterTag:'IF IT PERSISTS, OPEN A GITHUB ISSUE',
      contactEyebrow:'/// DEVELOPER SUPPORT', contactTitle1:'CONTACT THE', contactTitle2:'DEVELOPER',
      contactLead:'Found a bug, have a suggestion, or want to contribute? Open an issue on GitHub so the project can be reviewed and tracked.',
      contactRepoTitle:'SOURCE CODE', contactRepoText:'Explore the website source, firmware tools, and project files on GitHub.',
      contactIssueTitle:'REPORT A PROBLEM', contactIssueText:'Describe the steps that caused the issue and attach a screenshot or Serial Log to help with troubleshooting.',
      contactTemplateTitle:'Details to include in a report', contactTemplateText:'Copy the template below and fill it in when opening a GitHub issue.',
      contactCopy:'COPY TEMPLATE', contactCopied:'COPIED', contactChecklist:'Board:\\nFirmware version:\\nControl device:\\nBrowser:\\nIssue observed:\\nSteps to reproduce:\\nError message / Serial Log:',
      contactFooterNote:'Contact and issue reporting', contactFooterTag:'THANKS FOR HELPING IMPROVE THE PROJECT'
    }
  };
  const getLang = () => localStorage.getItem(KEY) === 'en' ? 'en' : 'th';
  function apply() {
    const lang = getLang();
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-site-i18n]').forEach(el => {
      const value = words[lang][el.dataset.siteI18n];
      if (value !== undefined) if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') el.value = value; else el.textContent = value;
    });
    document.querySelectorAll('[data-site-lang]').forEach(button => {
      const active = button.dataset.siteLang === lang;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }
  window.refreshSiteNavLanguage = apply;
  window.setSiteLanguage = next => {
    if (next !== 'th' && next !== 'en') return;
    localStorage.setItem(KEY, next);
    apply();
  };
  document.querySelectorAll('[data-site-lang]').forEach(button => {
    button.addEventListener('click', () => window.setSiteLanguage(button.dataset.siteLang));
  });
  apply();
})();