import RNFS from 'react-native-fs';
import _ from 'lodash';
import { Linking } from 'react-native';

export const isFunction = funCtion => _.isFunction(funCtion);

export const getBase64 = image => {
  if (!image) {
    return;
  }

  RNFS.readFile(image, 'base64').then(res => {
    return res;
  });
};

export const getFileName = (filePath = undefined) => {
  if (filePath == undefined) return;

  return filePath.substring(filePath.lastIndexOf('/') + 1, filePath.length);
};

export const openLinks = async link => {
  try {
    const sup = await Linking.canOpenURL(`${link}`);
    if (sup) {
      Linking.openURL(`${link}`)
        .then(res => console.log(res))
        .catch(err => console.log(err));
    } else console.log('unable to open url');
  } catch (err_1) {
    return console.log('Unable to open URI: ' + err_1);
  }
};

export const noImag =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png';

export const getCurrentWeekDates = () => {
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  const labels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d.getDate().toString();
  });

  return labels;
};

export const getFullWeekDatesArray = () => {
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  const labels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d.toISOString().split('T')[0];
  });
  return labels;
};

export function formatDate(dateInput) {
  if (!dateInput) return "";

  let date;

  if (dateInput instanceof Date) {
    date = dateInput;
  } else if (typeof dateInput === "string") {
    // Replace the space with 'T' to make it ISO-compliant
    const isoString = dateInput.replace(" ", "T");
    date = new Date(isoString);
  } else {
    date = new Date(dateInput);
  }

  // Check for invalid date
  if (isNaN(date.getTime())) return "";

  // Format as "22nd September 2025"
  const day = date.getDate();
  const month = date.toLocaleString("en-GB", { month: "long" });
  const year = date.getFullYear();

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  return `${day}${suffix} ${month} ${year}`;
}
