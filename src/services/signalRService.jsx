import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder()
  .withUrl('https://hairhub.gahonghac.net/book-appointment-hub') // Thay thế bằng URL của SignalR hub của bạn
  .build();

export const startConnection = async () => {
  if (connection.state === signalR.HubConnectionState.Disconnected) {
    try {
      await connection.start();
      console.log('Connected to SignalR Hub');
    } catch (err) {
      console.error('Connection error: ', err);
    }
  } else {
    console.log('Connection is already started or in the process of starting.');
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

export const onReceiveAppointmentCreated = (callback) => {
  connection.on('AppointmentCreated', (message) => {
    callback(message);
  });
};

export const sendBookingMessage = async (message) => {
  try {
    await connection.invoke('BookAppointmentMessage', message); // Thay thế 'BookAppointmentMessage' bằng tên phương thức của bạn
  } catch (err) {
    console.error('Send message error: ', err);
  }
};
