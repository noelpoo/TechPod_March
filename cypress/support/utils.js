export const getCurrentDate = function () {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = dd + "/" + mm + "/" + yyyy;
  return String(today);
};

export const checkListOrder = (item_list, order) => {
  let is_correct = false;
  switch (order) {
    case "descending":
      for (let i = 0; i < item_list.length - 1; i++) {
        is_correct = item_list[i + 1].create_time < item_list[i].create_time;
        if (is_correct) {
          continue;
        } else {
          return false;
        }
      }
      return is_correct;
    case "ascending":
      for (let i = 0; i < item_list.length - 1; i++) {
        is_correct = item_list[i + 1].create_time > item_list[i].create_time;
        if (is_correct) {
          continue;
        } else {
          return false;
        }
      }
      return is_correct;
    default:
      for (let i = 0; i < item_list.length - 1; i++) {
        is_correct = item_list[i + 1].create_time < item_list[i].create_time;
        if (is_correct) {
          continue;
        } else {
          return false;
        }
      }
      return is_correct;
  }
};

export const generateRandomItemName = (length) => {
  var result = "";
  var characters = "abcdefghijklmnopqrstuvwxyz";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const generateRandomPrice = () => {
  return Math.floor(Math.random() * 200) + 1;
};
