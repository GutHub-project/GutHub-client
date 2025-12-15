const formattedDate = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${month}월 ${day}일`;
}

export default formattedDate;