document.addEventListener('DOMContentLoaded', () => {
  const signInForm = document.querySelector('#sign-in-form');
  const signUpForm = document.querySelector('#sign-up-form');
  const signInBtn = document.querySelector("#sign-in-btn");
  const signUpBtn = document.querySelector("#sign-up-btn");
  const container = document.querySelector(".container");

  // Alternar entre os modos de formulário
  signUpBtn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
  });

  signInBtn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
  });

  // Função para validar o email
  function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  // Lidar com o envio do formulário de login
  signInForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.querySelector('#sign-in-username').value;
    const password = document.querySelector('#sign-in-password').value;

    if (!isValidEmail(email)) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }

    try {
      const response = await fetch('https://localhost:7072/Cadastro/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Email: email, Senha: password }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message); // Loga a mensagem de sucesso
        // Redireciona o usuário ao localhost:3000 após login bem-sucedido
        localStorage.setItem("emailUser", email);
        window.location.href = `http://localhost:3000/${email}`;
      } else {
        const result = await response.json();
        console.error('Erro ao fazer login:', result);
        alert(result.message || 'Erro ao fazer login. Verifique suas credenciais.');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      alert('Erro de rede. Tente novamente mais tarde.');
    }
  });

  // Lidar com o envio do formulário de cadastro
  signUpForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.querySelector('#sign-up-username').value;
    const email = document.querySelector('#sign-up-email').value;
    const password = document.querySelector('#sign-up-password').value;

    if (!isValidEmail(email)) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }

    try {
      const response = await fetch('https://localhost:7072/Cadastro/Cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Nome: username, Email: email, Senha: password }),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Cadastro realizado com sucesso! Você pode fazer login agora.');
        container.classList.remove("sign-up-mode"); // Volta para o formulário de login
      } else {
        const result = await response.json();
        console.error('Erro ao se cadastrar:', result.errors);
        alert(result.errors[0]?.message || 'Erro ao se cadastrar. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      alert('Erro de rede. Tente novamente mais tarde.');
    }
  });
});
