/* eslint-disable import/no-extraneous-dependencies */
import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

function truncate(str, maxLength) {
  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
}

function getUsernameFromEmail(email) {
  return email.split('@')[0];
}

const myBody = document.querySelector('body');

const container = document.createElement('div');
container.classList.add('container');
myBody.append(container);

const msgArr = [];
const getEmailInterval = setInterval(() => {
  const obs$ = ajax.getJSON('http://localhost:3000/messages/unread').pipe(
    map((userResponse) => {
      if (userResponse.messages && Array.isArray(userResponse.messages)) {
        userResponse.messages.forEach((msg) => {
          const exists = msgArr.some((arrMsg) => arrMsg.id === msg.id);
          if (!exists) {
            msgArr.push(msg);

            const date = new Date(msg.received);
            const formattedDate = date.toLocaleString('ru-RU');

            const mailBox = document.createElement('div');
            mailBox.classList.add('mail-box');

            const userName = document.createElement('div');
            userName.classList.add('user-name');
            userName.textContent = getUsernameFromEmail(msg.from);
            mailBox.append(userName);

            const text = document.createElement('div');
            text.classList.add('text');
            text.textContent = truncate(msg.subject, 15);
            mailBox.append(text);

            const mailTime = document.createElement('div');
            mailTime.classList.add('mail-time');
            mailTime.textContent = formattedDate;
            mailBox.append(mailTime);

            container.prepend(mailBox);
          }
        });
      } else {
        console.warn('Ответ не содержит поля messages или это не массив:', userResponse);
      }
    }),
    catchError((error) => {
      console.error('Ошибка при получении данных:', error);
      // Возвращаем "пустой" ответ, как если бы новых сообщений не было
      return of({ messages: [] });
    }),
  );

  obs$.subscribe({
    next: () => {
      console.log('Обновлённый msgArr:', msgArr);

      if (msgArr.length >= 20) {
        clearInterval(getEmailInterval);
        console.log('Максимальное количество писем');
      }
    },
    error: (err) => console.error(err),
  });
}, 10000);
