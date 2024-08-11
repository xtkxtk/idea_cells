
# Idea Cells

Idea Cells는 아이디어를 생성하고 관리하는 웹 애플리케이션입니다. 사용자는 주제를 입력하고, 이를 바탕으로 하위 아이디어를 생성하거나 여러 아이디어를 병합하여 새로운 아이디어를 생성할 수 있습니다. 이 애플리케이션은 Google Generative AI 모델을 사용하여 아이디어를 자동으로 생성합니다.

## 주요 기능

- **아이디어 생성**: 입력된 주제를 기반으로 3개의 하위 아이디어를 생성합니다.
- **아이디어 병합**: 선택된 여러 아이디어를 병합하여 하나의 새로운 아이디어를 생성합니다.
- **다중 선택 및 병합**: Ctrl 키를 사용하여 여러 아이디어를 선택하고 병합할 수 있습니다.
- **셀 위치 자동 조정**: 생성된 아이디어 셀의 위치가 자동으로 조정됩니다.

## 설치 방법

1. **레포지토리 클론**:

   ```bash
   git clone https://github.com/yourusername/idea-splitter-merger.git
   cd idea-splitter-merger
   ```

2. **패키지 설치**:

   ```bash
   npm install
   ```

3. **환경 변수 설정**:

   프로젝트 루트 디렉토리에 `.env` 파일을 생성하고, Google Generative AI API 키를 추가하세요.

   ```plaintext
   REACT_APP_API_KEY=your_actual_api_key_here
   ```

4. **개발 서버 실행**:

   ```bash
   npm start
   ```

   브라우저에서 `http://localhost:3000`에 접속하여 애플리케이션을 확인할 수 있습니다.

## 사용 방법

- **아이디어 생성**: 셀을 더블 클릭하여 아이디어를 생성할 수 있습니다.
- **아이디어 병합**: Ctrl 키를 누른 상태에서 여러 셀을 클릭한 후, 병합 버튼을 클릭하여 아이디어를 병합할 수 있습니다.
- **셀 편집**: 셀을 클릭하여 텍스트를 편집할 수 있습니다.

## 기술 스택

- **프론트엔드**: React, JavaScript, HTML, CSS
- **AI 모델**: Google Generative AI (Gemini 1.5 Flash)
- **스타일링**: CSS Grid

## 주의 사항

- **API 키 보안**: `.env` 파일에 API 키를 저장하고, 이 파일을 `.gitignore`에 추가하여 깃허브에 업로드되지 않도록 주의하세요.
- **빌드 시 주의**: `REACT_APP_`으로 시작하는 환경 변수만 빌드에 포함되므로, API 키 설정 시 주의가 필요합니다.

## 기여 방법

1. 이 레포지토리를 포크합니다.
2. 새로운 브랜치를 만듭니다. (`git checkout -b feature/your-feature-name`)
3. 기능을 추가하거나 버그를 수정합니다.
4. 변경 사항을 커밋합니다. (`git commit -m 'Add your message here'`)
5. 브랜치를 푸시합니다. (`git push origin feature/your-feature-name`)
6. Pull Request를 생성합니다.

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](./LICENSE) 파일을 참조하세요.
```
