async function updatecourseid(id) {
  const result = await Course.findByIdAndUpdate(
    id,
    { $set: { price: "500" } },
    { new: true }
  );
  console.log(result);
}
