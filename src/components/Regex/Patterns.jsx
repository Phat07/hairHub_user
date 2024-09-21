export const phonePattern = /^0[3,4,5,6,7,8,9][0-9]{8}$/; // input 10 phone digits
export const pwdPattern = /^[A-Z][\w, \W]{7,40}/; //password minimium 8 characters
// export const emailPattern = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/; 
export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const userNamePattern = /^[a-zA-Z0-9]{5,}$/; //username at least 5 characters
// export const fullNamePattern = /^([A-Z][a-z]+)(?:\s[A-Z][a-z]+)*$/;
// Vietnamse regex
export const fullNamePattern =
  /^([aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ0-9 ]){1,26}$/;
