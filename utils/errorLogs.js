function createErrorLog(data) {
  const errorLog = {
    date: data.date || new Date(),
    page: data.page || null,
    api: data.api || null,
    method: data.method || null,
    headers: data.headers || null,
    body: data.body || null,
    user: data.user || null,
    error: {
      message: data.error.message || null,
      stack: data.error.stack || null,
    },
    status: data.status || "Occurred",
  };

  return errorLog;
}

module.exports = createErrorLog;
