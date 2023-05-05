interface Option {
  value: number;
  label: string;
}

export const options: Option[] = [
  { value: 200, label: "200 OK" },
  { value: 201, label: "201 Created" },
  { value: 204, label: "204 No Content" },
  { value: 301, label: "301 Moved Permanently" },
  { value: 302, label: "302 Found" },
  { value: 303, label: "303 See Other" },
  { value: 307, label: "307 Temporary Redirect" },
  { value: 308, label: "308 Permanent Redirect" },
  { value: 400, label: "400 Bad Request" },
  { value: 401, label: "401 Unauthorized" },
  { value: 403, label: "403 Forbidden" },
  { value: 404, label: "404 Not Found" },
  { value: 405, label: "405 Method Not Allowed" },
  { value: 409, label: "409 Conflict" },
  { value: 410, label: "410 Gone" },
  { value: 412, label: "412 Precondition Failed" },
  { value: 413, label: "413 Payload Too Large" },
  { value: 415, label: "415 Unsupported Media Type" },
  { value: 422, label: "422 Unprocessable Entity" },
  { value: 429, label: "429 Too Many Requests" },
  { value: 500, label: "500 Internal Server Error" },
  { value: 501, label: "501 Not Implemented" },
  { value: 502, label: "502 Bad Gateway" },
  { value: 503, label: "503 Service Unavailable" },
  { value: 504, label: "504 Gateway Timeout" },
];
