# 풍경 수채화 6주 작품첩

로그인 없이 링크만 열면 누구나 이름을 고르고, 주차별 그림을 올리고, 고칠 수 있는 사이트입니다.
명단과 그림은 Netlify 안의 저장소(Netlify Blobs)에 저장되어 다른 서비스 가입이 필요 없습니다.

## 폴더 구성
- `public/index.html` — 화면
- `netlify/functions/api.mjs` — 그림·이름을 저장하는 서버 기능
- `netlify.toml`, `package.json` — Netlify 설정

## 등록 방법 (처음 한 번)
이 사이트는 서버 기능이 있어서 Netlify의 끌어다 놓기(Drop) 배포로는 저장이 되지 않습니다. GitHub를 통해 한 번 연결해 주세요.

1. github.com에 로그인 → 오른쪽 위 **+** → **New repository** → 이름(예: `watercolor-atelier`)을 쓰고 **Create repository**
2. 새 저장소 화면에서 **uploading an existing file** 클릭 → 압축을 푼 폴더 **안의 내용 전부**(`public`, `netlify` 폴더와 `netlify.toml`, `package.json`, `README.md`)를 끌어다 놓기 → **Commit changes**
3. app.netlify.com → `seoyeon-eileen` 사이트 → **Site configuration → Build & deploy → Link repository** → GitHub → 방금 만든 저장소 선택
   - 빌드 설정은 자동으로 채워집니다(Publish directory: `public`). 그대로 **Deploy**
   - 새 사이트로 만들고 싶다면 **Add new site → Import an existing project**를 고르면 됩니다.
4. 배포가 끝나면 https://seoyeon-eileen.netlify.app 에서 바로 사용할 수 있습니다. 위쪽에 '미리보기 모드' 안내가 보이지 않으면 정상 연결된 것입니다.

나중에 화면을 고치고 싶으면 GitHub에서 파일을 바꾸기만 하면 Netlify가 자동으로 다시 배포합니다. 저장된 그림과 이름은 그대로 남습니다.

## 알아 두기
- 링크를 아는 사람은 누구나 모든 칸을 고치거나 지울 수 있으니, 링크는 수강생 단톡방 안에서만 공유해 주세요.
- 그림은 올릴 때 긴 변 2400px JPEG로 줄어 한 장에 0.5~1MB 정도입니다.
