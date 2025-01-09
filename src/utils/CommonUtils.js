import moment from 'moment';

class CommonUtils {
    static isNumber1(number) {
        if (number === 1) return true;
        return false;
    }

    static getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    static convertToISOString(dateStr) {

        // Parse chuỗi ngày '03/01/2025' với định dạng 'DD/MM/YYYY'
        let date = moment(dateStr, 'DD/MM/YYYY');

        // Lùi 7 giờ (giả sử bạn muốn chuyển về 17:00 UTC của ngày hôm trước)
        date = date.subtract(7, 'hours');

        // Trả về chuỗi ISO
        return date.toISOString();
    }
}

export default CommonUtils;