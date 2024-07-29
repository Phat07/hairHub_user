// import hellaLogo from '../img/hellaBookingLogo.png'

import { FacebookOutlined, InstagramOutlined } from "@ant-design/icons";

const FacebookIcon = <FacebookOutlined />;
const InstagramIcon = <InstagramOutlined />;

export const header = [
  {
    title: "Tour",
    children: [],
  },
  {
    title: "Tour Guide",
    children: [],
  },
  {
    title: "Login",
    children: [],
  },
  {
    title: "User",
    children: [],
  },
];
export const banner = [
  {
    img: "https://res.cloudinary.com/dtlvihfka/image/upload/v1709537133/e5vdcvf6lzefr33lbarc.png",
    imgMobile:
      "https://gw.alipayobjects.com/zos/rmsportal/ksMYqrCyhwQNdBKReFIU.svg",
    className: "seeconf-wrap",
    children: [
      {
        children: "Seeking Experience & Engineering Conference",
        className: "seeconf-en-name",
      },
      {
        children: "首届蚂蚁体验科技大会",
        className: "seeconf-title",
        tag: "h1",
      },
      {
        children: "探索极致用户体验与最佳工程实践",
        className: "seeconf-cn-name",
      },
      {
        children: "了解详细",
        className: "banner-button",
        tag: "button",
        link: "https://seeconf.alipay.com/",
      },
      { children: "2018.01.06 / 中国·杭州", className: "seeconf-time" },
    ],
  },
  {
    img: "https://gw.alipayobjects.com/zos/rmsportal/cTyLQiaRrpzxFAuWwoDQ.svg",
    imgMobile:
      "https://gw.alipayobjects.com/zos/rmsportal/ksMYqrCyhwQNdBKReFIU.svg",
    className: "seeconf-wrap",
    children: [
      {
        children: "Seeking Experience & Engineering Conference",
        className: "seeconf-en-name",
      },
      {
        children: "首届蚂蚁体验科技大会",
        className: "seeconf-title",
        tag: "h1",
      },
      {
        children: "探索极致用户体验与最佳工程实践",
        className: "seeconf-cn-name",
      },
      {
        children: "了解详细",
        className: "banner-button",
        tag: "button",
        link: "https://seeconf.alipay.com/",
      },
      { children: "2018.01.06 / 中国·杭州", className: "seeconf-time" },
    ],
  },
];
export const page1 = {
  title: "自然好用的设计",
  children: [
    {
      title: "设计价值观",
      content: "Design Values",
      src: "https://gw.alipayobjects.com/zos/rmsportal/KtRzkMmxBuWCVjPbBgRY.svg",
      color: "#EB2F96",
      shadowColor: "rgba(166, 55, 112, 0.08)",
      link: "https://ant.design/docs/spec/values-cn",
    },
    {
      title: "视觉",
      content: "Visual",
      src: "https://gw.alipayobjects.com/zos/rmsportal/qIcZMXoztWjrnxzCNTHv.svg",
      color: "#1890FF",
      shadowColor: "rgba(15, 93, 166, 0.08)",
      link: "https://ant.design/docs/spec/colors-cn",
    },
    {
      title: "可视化",
      content: "Visualisation",
      src: "https://gw.alipayobjects.com/zos/rmsportal/eLtHtrKjXfabZfRchvVT.svg",
      color: "#AB33F7",
      shadowColor: "rgba(112, 73, 166, 0.08)",
      link: "https://antv.alipay.com/zh-cn/vis/index.html",
    },
  ],
};

export const page3 = {
  title: "大家都喜爱的产品",
  children: [
    {
      img: "https://gw.alipayobjects.com/zos/rmsportal/iVOzVyhyQkQDhRsuyBXC.svg",
      imgMobile:
        "https://gw.alipayobjects.com/zos/rmsportal/HxEfljPlykWElfhidpxR.svg",
      src: "https://gw.alipayobjects.com/os/rmsportal/gCFHQneMNZMMYEdlHxqK.mp4",
    },
    {
      img: "https://gw.alipayobjects.com/zos/rmsportal/iVOzVyhyQkQDhRsuyBXC.svg",
      imgMobile:
        "https://gw.alipayobjects.com/zos/rmsportal/HxEfljPlykWElfhidpxR.svg",
      src: "https://gw.alipayobjects.com/os/rmsportal/gCFHQneMNZMMYEdlHxqK.mp4",
    },
  ],
};

export const page4 = {
  title: "众多企业正在使用",
  children: [
    "https://gw.alipayobjects.com/zos/rmsportal/qImQXNUdQgqAKpPgzxyK.svg", // 阿里巴巴
    "https://gw.alipayobjects.com/zos/rmsportal/LqRoouplkwgeOVjFBIRp.svg", // 蚂蚁金服
    "https://gw.alipayobjects.com/zos/rmsportal/TLCyoAagnCGXUlbsMTWq.svg", // 人民网
    "https://gw.alipayobjects.com/zos/rmsportal/HmCGMKcJQMwfPLNCIhOH.svg", // cisco
    "https://gw.alipayobjects.com/zos/rmsportal/aqldfFDDqRVFRxqLUZOk.svg", // GrowingIO
    "https://gw.alipayobjects.com/zos/rmsportal/rqNeEFCGFuwiDKHaVaPp.svg", // 饿了么
    "https://gw.alipayobjects.com/zos/rmsportal/FdborlfwBxkWIqKbgRtq.svg", // 滴滴出行
    "https://gw.alipayobjects.com/zos/rmsportal/coPmiBkAGVTuTNFVRUcg.png", // 飞凡网
  ],
};

export const footer = [
  // {
  //   title: "Hair Cut",
  //   children: [
  //     { title: "Your Email", link: "https://atec.antfin.com" },
  //     { title: "Sent", link: "https://seeconf.alipay.com" },
  //   ],
  // },
  {
    title: "Liên hệ chúng tôi",
    children: [
      {
        title: "Nơi làm việc: 27 Hang Tre, Q9, Tp.Thu Duc",
        link: "https://open.alipay.com",
      },
      { title: "Điện thoại: 0112233444", link: "https://xcloud.alipay.com" },
    ],
  },
  {
    title: "Về chúng tôi",
    children: [
      {
        title: "Câu chuyện của chúng tôi",
        link: "https://zhuanlan.zhihu.com/xtech",
      },
      {
        title: "Làm việc cùng chúng tôi",
        link: "https://weibo.com/p/1005056420205486",
      },
    ],
  },
  {
    title: "HairHub",
    icon: "https://res.cloudinary.com/dtlvihfka/image/upload/v1709178491/ekmd80ee6du84b0nptld.png",
    children: [
      {
        title: "Facebook",
        // desc: "HairHubFacebook",
        icon: FacebookIcon,
        link: "https://www.facebook.com/profile.php?id=61559941142117",
      },
      {
        title: "Instagram",
        // desc: "HairHubInsta",
        icon: InstagramIcon,
        link: "https://www.instagram.com/hair_hub2024/?fbclid=IwZXh0bgNhZW0CMTAAAR3sWDeDZ957j5s8TsuWVmPVGMI6rhCyd2yRYUFkkGkAe0zEAHzqIDlemCs_aem_AbUa6aEpQtmUuEW8g6ssUs_ERY1IVr0xUoxHNrF7jRhPffdql_fdShUsc44kXWiVJMN95L0G7FjSfnefmnzZ5aPh",
      },
      // { title: 'AntG', desc: '蚂蚁互动图形技术', link: 'http://antg.alipay.net' },
      // { title: 'LinkedIn', desc: 'HairHubLinkedIn', link: 'https://eggjs.org' },
      // { title: 'Twitter', desc: 'HellaTwitter', link: 'https://fengdie.alipay-eco.com/intro' },
    ],
  },
];

// 图处预加载；
if (typeof document !== "undefined") {
  const div = document.createElement("div");
  div.style.display = "none";
  document.body.appendChild(div);
  [
    "https://gw.alipayobjects.com/zos/rmsportal/KtRzkMmxBuWCVjPbBgRY.svg",
    "https://gw.alipayobjects.com/zos/rmsportal/qIcZMXoztWjrnxzCNTHv.svg",
    "https://gw.alipayobjects.com/zos/rmsportal/eLtHtrKjXfabZfRchvVT.svg",
    "https://gw.alipayobjects.com/zos/rmsportal/iVOzVyhyQkQDhRsuyBXC.svg",
    "https://gw.alipayobjects.com/zos/rmsportal/HxEfljPlykWElfhidpxR.svg",
    "https://gw.alipayobjects.com/zos/rmsportal/wdarlDDcdCaVoCprCRwB.svg",
  ]
    .concat(page4.children)
    .forEach((src) => {
      const img = new Image();
      img.src = src;
      div.appendChild(img);
    });
}
