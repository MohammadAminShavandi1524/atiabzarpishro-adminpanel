export interface ContactRequest {
  id: number;
  full_name: string;
  phone_number: string;
  email: string;
  company: string;
  message: string;
  created: string;
}

export async function getContactRequests(): Promise<ContactRequest[]> {
  const response = await fetch("/api/contact-requests", {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}