document.addEventListener('DOMContentLoaded', () => {

    // 게임 상태 변수
    const hints = [null, null, null, null];
    const solvedPuzzles = {
        speaker: false,
        clock: false,
        computer: false,
        books: false
    };

    // DOM 요소 가져오기
    const gameModal = document.getElementById('game-modal');
    const doorModal = document.getElementById('door-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const collectedHints = document.getElementById('collected-hints');

    // 모달 닫기 버튼
    const closeGameModalBtn = document.getElementById('close-game-modal');
    const closeDoorModalBtn = document.getElementById('close-door-modal');

    // 오브젝트 클릭 이벤트 리스너 설정
    document.getElementById('speaker').addEventListener('click', () => openGame('speaker'));
    document.getElementById('clock').addEventListener('click', () => openGame('clock'));
    document.getElementById('computer').addEventListener('click', () => openGame('computer'));
    document.getElementById('books').addEventListener('click', () => openGame('books'));
    document.getElementById('door').addEventListener('click', () => openDoor());

    // 공통 게임 열기 함수
    function openGame(puzzleId) {
        if (solvedPuzzles[puzzleId]) {
            alert('이미 해결한 문제입니다.');
            return;
        }

        let title = '';
        let contentHTML = '';

        switch (puzzleId) {
            case 'speaker':
                title = '소리의 주인을 찾아라!';
                contentHTML = `
                    <p>스피커에서 학교 종소리가 들린다.<br>어떤 것이 올바른 파형일까?</p>
                    <button data-answer="wrong">파형 A</button>
                    <button data-answer="correct">파형 B (정답)</button>
                    <button data-answer="wrong">파형 C</button>
                `;
                break;
            case 'clock':
                title = '멈춰버린 시간을 되돌려라!';
                contentHTML = `
                    <p>시계 퍼즐을 맞췄더니 메시지가 나타났다.<br>"비밀번호의 두 번째 숫자는... 아무것도 없는 '무(無)'의 상태를 나타내는 숫자이다."</p>
                    <input type="text" id="clock-answer" placeholder="숫자 입력">
                    <button id="clock-submit">확인</button>
                `;
                break;
            case 'computer':
                title = '다른 그림을 찾아라!';
                contentHTML = `
                    <p>컴퓨터 화면에 문제가 떠 있다.<br>"칠판 아래를 잘 보시오. 거기에 놓인 '분필'의 총 개수가 세 번째 힌트요."</p>
                    <input type="text" id="computer-answer" placeholder="개수 입력">
                    <button id="computer-submit">확인</button>
                `;
                break;
            case 'books':
                title = '선생님의 메시지를 해독하라!';
                contentHTML = `
                    <p style="font-size:16px; text-align:left; border:1px solid #ddd; padding:10px; line-height:1.6;">
                        "우리의 <b>미래</b>를 위한 연구는 계속되어야 한다. 이 연구의 성공은 <b>미래</b> 세대를 위한 희망의 불씨가 될 것이며, 나는 이 교실에서 <b>미래</b>를 향한 첫걸음을 내디뎠다. 우리가 꿈꾸는 <b>미래</b>는 결코 멀리 있지 않다. 이 모든 것은 우리의 <b>미래</b>를 위함이다."
                    </p>
                    <p>위 문장에서 '미래'라는 단어는 총 몇 번 나올까?</p>
                    <input type="text" id="books-answer" placeholder="횟수 입력">
                    <button id="books-submit">확인</button>
                `;
                break;
        }

        modalTitle.textContent = title;
        modalBody.innerHTML = contentHTML;
        addGameLogic(puzzleId); // 각 게임에 맞는 로직 추가
        gameModal.style.display = 'flex';
    }

    // 각 미니게임의 정답/오답 로직 추가
    function addGameLogic(puzzleId) {
        switch (puzzleId) {
            case 'speaker':
                modalBody.querySelectorAll('button').forEach(button => {
                    button.addEventListener('click', (e) => {
                        if (e.target.dataset.answer === 'correct') {
                            completePuzzle('speaker', 0, 2, "딩동댕! 비밀번호의 첫 번째 숫자는 이 교실에 스피커가 걸린 벽의 개수와 같습니다.");
                        } else {
                            alert('잘못된 파형입니다.');
                        }
                    });
                });
                break;
            case 'clock':
                document.getElementById('clock-submit').addEventListener('click', () => {
                    if (document.getElementById('clock-answer').value === '0') {
                        completePuzzle('clock', 1, 0, "완벽해요! 비밀번호의 두 번째 숫자는 0입니다.");
                    } else {
                        alert('틀렸습니다. 다시 생각해보세요.');
                    }
                });
                break;
            case 'computer':
                document.getElementById('computer-submit').addEventListener('click', () => {
                    if (document.getElementById('computer-answer').value === '2') {
                        completePuzzle('computer', 2, 2, "놀라운 관찰력이네요! 비밀번호의 세 번째 숫자는 2입니다.");
                    } else {
                        alert('아닙니다. 칠판 아래를 다시 잘 보세요.');
                    }
                });
                break;
            case 'books':
                document.getElementById('books-submit').addEventListener('click', () => {
                    if (document.getElementById('books-answer').value === '5') {
                        completePuzzle('books', 3, 5, "정확합니다! 비밀번호의 마지막 숫자는 5입니다.");
                    } else {
                        alert('틀렸습니다. 단어를 다시 세어보세요.');
                    }
                });
                break;
        }
    }

    // 퍼즐 해결 처리 함수
    function completePuzzle(puzzleId, hintIndex, hintValue, successMessage) {
        alert(successMessage);
        solvedPuzzles[puzzleId] = true;
        hints[hintIndex] = hintValue;
        updateHintDisplay();
        closeGameModal();
    }

    // 힌트 UI 업데이트 함수
    function updateHintDisplay() {
        const displayString = hints.map(h => (h === null ? '?' : h)).join(' ');
        collectedHints.textContent = `[ ${displayString} ]`;
    }
    
    // 문 열기 시도
    function openDoor() {
        doorModal.style.display = 'flex';
        document.getElementById('password-input').value = ''; // 입력 필드 초기화
    }
    
    // 비밀번호 제출
    document.getElementById('submit-password').addEventListener('click', () => {
        const inputPassword = document.getElementById('password-input').value;
        const correctPassword = hints.join('');

        if (hints.includes(null)) {
            alert('아직 모든 힌트를 찾지 못했습니다!');
            return;
        }

        if (inputPassword === correctPassword) {
            // 진짜 정답은 '2025'이므로 한번 더 확인
            if (correctPassword === '2025') {
                alert('철컥-! 문이 열렸습니다. 탈출을 축하합니다!');
                closeDoorModal();
                // 여기에 게임 성공 후 페이지 이동 등 추가 로직을 넣을 수 있습니다.
                location.reload(); // 예시로 페이지 새로고침
            } else {
                 alert('힌트 조합이 잘못된 것 같습니다. 다시 확인해주세요.');
            }
        } else {
            alert('비밀번호가 틀렸습니다.');
        }
    });

    // 모달 닫기
    function closeGameModal() {
        gameModal.style.display = 'none';
    }
    function closeDoorModal() {
        doorModal.style.display = 'none';
    }
    closeGameModalBtn.addEventListener('click', closeGameModal);
    closeDoorModalBtn.addEventListener('click', closeDoorModal);

    // 모달 바깥 영역 클릭 시 닫기
    window.addEventListener('click', (event) => {
        if (event.target == gameModal) {
            closeGameModal();
        }
        if (event.target == doorModal) {
            closeDoorModal();
        }
    });
});