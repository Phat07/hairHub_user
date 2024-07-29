export const phonePattern = /^0[3,4,5,6,7,8,9][0-9]{8}$/; // input 10 phone digits
export const pwdPattern = /^[A-Z][\w, \W]{8,40}/; //password minimium 8 characters
export const emailPattern = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/; //email match @exapmle.com
export const userNamePattern = /^[a-zA-Z0-9]{5,}$/; //username at least 5 characters
// export const fullNamePattern = /^([A-Z][a-z]+)(?:\s[A-Z][a-z]+)*$/;
// Vietnamse regex
export const fullNamePattern =
  /^([aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ ]){1,26}$/;
