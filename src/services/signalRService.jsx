import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder()
  .withUrl('https://hairhub.gahonghac.net/book-appointment-hub') // Thay thế bằng URL của SignalR hub của bạn
  .build();

  // export const startConnection = async () => {
  //   console.log('Current connection state:', connection.state);
  //   // Check if the connection is not in Disconnected state
  //   if (connection.state === signalR.HubConnectionState.Disconnected) {
  //     try {
  //       await connection.start();
  //       console.log('Connected to SignalR Hub');
  //     } catch (err) {
  //       console.error('Connection error: ', err);
  //     }
  //   } else if (connection.state === signalR.HubConnectionState.Connecting) {
  //     console.log('Connection is currently in the process of starting.');
  //   } else if (connection.state === signalR.HubConnectionState.Connected) {
  //     console.log('Connection is already connected.');
  //   } else if (connection.state === signalR.HubConnectionState.Reconnecting) {
  //     console.log('Connection is currently reconnecting.');
  //   } else {
  //     console.log('Unknown connection state:', connection.state);
  //   }
  // };
  export const startConnection = async () => {
  
    if (connection.state === signalR.HubConnectionState.Disconnected) {
      try {
        connection.onclose((error) => {
          console.error('Connection closed due to error:', error);
        });
  
        connection.onreconnected(() => {
          console.log('Reconnected to SignalR Hub');
        });
  
        connection.onreconnecting((error) => {
          console.log('Reconnecting to SignalR Hub, error:', error);
        });
  
        await connection.start();
  
        if (connection.state === signalR.HubConnectionState.Connected) {
          // console.log('Connected to SignalR Hub');
        } else {
          // console.error('Connection state after start:', connection.state);
        }
      } catch (err) {
        // console.error('Connection error:', err);
        throw err; // Ném lỗi để catch trong useEffect
      }
    } else {
      console.log('Connection already in state:', connection.state);
    }
  };
  

export const stopConnection = async () => {
  try {
    await connection.stop();
    console.log('Disconnected from SignalR Hub');
  } catch (err) {
    console.error('Disconnection error: ', err);
  }
};


export const onBookAppointmentMessage = (callback) => {
  console.log('Setting up event listener for AppointmentCreated');
  connection.on('ReceiveMessage', (message) => {
    console.log('ReceiveMessage event received:', message);

    // Assuming message is structured like the example: ["id has join","2024-09-02T22:54:39.1099985+07:00"]
    const messageData = JSON.parse(message);
    if (messageData.arguments && messageData.arguments.length > 1) {
      const dateStr = messageData.arguments[1];
      const date = new Date(dateStr);

      console.log('Extracted date:', date);

      // Call the callback with the parsed date
      callback(date);
    } else {
      console.warn('Unexpected message format:', message);
    }
  });
};

export const sendMessage = async (date,serviceHairIds) => {
  try {
    // Kiểm tra trạng thái kết nối
    if (connection.state === signalR.HubConnectionState.Connected) {
      console.log("demo");
      
      await connection.invoke('SendMessage', date,serviceHairIds);
    } else {
      console.log('Kết nối không ở trạng thái Connected. Không thể gửi dữ liệu.');
    }
  } catch (err) {
    console.error('Lỗi gửi tin nhắn:', err);
  }
};
export const sendBookingMessage = async (message) => {
  try {
    await connection.on('BookAppointmentMessage', message); // Thay thế 'BookAppointmentMessage' bằng tên phương thức của bạn
  } catch (err) {
    console.error('Send message error: ', err);
  }
};
