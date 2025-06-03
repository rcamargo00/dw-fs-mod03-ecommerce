class SignIn {
  constructor(userRepository, passwordHasher, tokenGenerator) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenGenerator = tokenGenerator;
  }
 
  async execute({ username, password }) {
    const user = await this.userRepository.findByUsername(username);
    if (!user) throw new Error('User not found');
    const isValid = await this.passwordHasher.compare(password, user.password);
    if (!isValid) throw new Error('Invalid password');
    const token = this.tokenGenerator.generate({ id: user._id, roles: user.roles });
    return { user, token };
  }
}
 
module.exports = SignIn;