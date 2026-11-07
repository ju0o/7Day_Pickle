# GitHub Pages 배포 가이드 (Zero-Workflow Native 배포)

OneWord는 외부 빌드 과정(Webpack, Vite 번들러 등)이 필요 없는 순수 정적 웹 애플리케이션입니다.
별도의 GitHub Actions 워크플로우 없이도 GitHub 저장소 설정에서 즉시 1초 만에 무료 배포할 수 있습니다.

## 배포 설정 3단계
1. GitHub 저장소(`ju0o/7Day_Pickle`) 접속
2. **Settings** -> **Pages** 탭 이동
3. **Build and deployment** 항목:
   - Source: **Deploy from a branch**
   - Branch: **main** / **/(root)** 선택 후 **Save**

저장 후 약 1분 이내에 `https://ju0o.github.io/7Day_Pickle/` 로 전 세계 어디서든 접속 가능한 라이브 웹사이트가 열립니다.
