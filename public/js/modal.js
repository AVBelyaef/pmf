const wrapperCircles = document.getElementById('circles');
const modal = document.getElementById('modal-big');
const btnModalClose = document.getElementById('modal-big-close');
const circles = document.querySelectorAll('.circle');
const buttons = document.querySelectorAll('.btn');

async function showModal(e) {
  e.preventDefault();
  let id = e.target.getAttribute('data-id');

  if (!id) {
    id = e.target.parentNode.getAttribute('data-id');
  }

  if (!id) {
    const div = document.createElement('div');
    div.innerHTML = '<h1>Ошибка! Data-id не задан.</h1>';
    modal.prepend(div);
    modal.classList.add('modal-big--show');

    return;
  }

  try {
    const response = await fetch(`/confluence/${id}`);
    const res = await response.json();

    if (res.error) {
      const div = document.createElement('div');
      div.innerHTML = res.error;
      modal.classList.add('modal-big--show');
      modal.prepend(div);

      return;
    }

    const div = document.createElement('div');
    const h1 = document.createElement('h1');
    const bodyWithTargetBlank = res.body.replaceAll(
      'href',
      'target="_blank" href'
    );

    h1.className = 'modal-big__title';
    h1.innerText = res.title;
    div.innerHTML = bodyWithTargetBlank;

    div.prepend(h1);

    modal.prepend(div);
  } catch (e) {
    console.error('Error: ', e);
  }

  modal.classList.add('modal-big--show');
}

function closeModal(event) {
  if (event.key && event.key !== 'Escape') {
    return;
  }

  if (modal.children.length > 1) {
    modal.children[0].remove();
  }

  modal.classList.remove('modal-big--show');
}

wrapperCircles.addEventListener('click', showModal);
document.addEventListener('keydown', closeModal);
btnModalClose.addEventListener('click', closeModal);

tippy([...circles, ...buttons], {
  content: 'Loading...',
  onShow(instance) {
    const id = instance.reference.getAttribute('data-id');

    if (!id) {
      instance.setContent('Не указан data-id');
      return;
    }

    fetch(`/confluenceTitle/${id}`)
      .then((response) => response.json())
      .then(({ data }) => {
        instance.setContent(data);
      })
      .catch((error) => {
        instance.setContent(`Request failed. ${error}`);
      });
  },
});
