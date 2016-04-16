module.exports = {
  firstNameNotBlank: function (input) {
    return !input.trim() ? 'First name cannot be blank!' : '';
  }
}
