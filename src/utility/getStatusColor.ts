const getStatusColor = (status: string) => {
  switch (status) {
    case "initiated":
      return "blue";
    case "pending":
      return "gold";
    case "paid":
      return "green";
    case "partial":
      return "orange";
    case "failed":
      return "red";
    default:
      return "default";
  }
};
export default getStatusColor;
