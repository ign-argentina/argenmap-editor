class Result {
  static success(data) {
    return {
      success: true,
      data: data,
    }
  }

  static fail(message) {
    return {
      success: false,
      error: message,
    }
  }
}

export default Result