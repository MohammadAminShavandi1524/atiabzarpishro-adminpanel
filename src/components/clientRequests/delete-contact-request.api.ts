export async function deleteContactRequest(id: string) {
  const response = await fetch(`/api/contact-requests/delete/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}
