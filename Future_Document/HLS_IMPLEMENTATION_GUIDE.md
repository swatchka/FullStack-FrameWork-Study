# 🎵 HLS (HTTP Live Streaming) 구현 가이드 (미래용)

> **작성일**: 2025-12-12
> **목적**: 현재의 MP3 단일 파일 다운로드 방식(Presigned URL)의 보안 한계를 극복하고, 스포티파이처럼 "스트리밍" 방식으로 전환하기 위한 기술 문서입니다. 훗날 이 문서를 보고 바로 구현할 수 있도록 절차를 정리했습니다.

---

## 1. HLS란 무엇인가?
*   **기존 방식 (Progressive Download)**: `bgm.mp3` 파일 하나를 통째로 전송. 다운로드가 매우 쉬움.
*   **HLS 방식 (Streaming)**:
    *   긴 음악 파일을 **10초 단위의 작은 조각 파일(.ts)** 수백 개로 자름.
    *   이 조각들의 순서를 적어둔 **재생 목록 파일(.m3u8)**을 만듦.
    *   브라우저는 `.m3u8`을 읽고, 필요한 조각(`ts`)만 그때그때 가져와서 재생함.
    *   **보안 효과**: 사용자가 다운로드를 시도해도 10초짜리 조각 하나만 받아지므로, 전체 음원을 훔치기 매우 까다로움.

---

## 2. 구현 단계 (Step-by-Step)

### 단계 1: FFmpeg 설치 및 파일 변환 (로컬 작업)
서버나 로컬 컴퓨터에 `ffmpeg`가 설치되어 있어야 합니다.

1.  **FFmpeg 설치**: [FFmpeg 공식 홈페이지](https://ffmpeg.org/download.html)에서 다운로드 및 설치.
2.  **변환 명령어 (터미널)**:
    MP3 파일을 HLS 포맷으로 변환합니다.
    ```bash
    ffmpeg -i bgm1.mp3 -c:a aac -b:a 128k -vn -hls_time 10 -hls_list_size 0 bgm1.m3u8
    ```
    *   `-hls_time 10`: 10초 단위로 자름.
    *   **결과물**: `bgm1.m3u8` (목록표) + `bgm10.ts`, `bgm11.ts`... (조각 파일들)

### 단계 2: S3 업로드 구조 변경
파일이 많아지므로 폴더 정리가 필수입니다.

*   **기존**: `s3://bucket/bgm1.mp3`
*   **변경**: `s3://bucket/music/bgm1/` 폴더 생성 후 그 안에 결과물 모두 업로드.
    *   `s3://bucket/music/bgm1/bgm1.m3u8`
    *   `s3://bucket/music/bgm1/bgm10.ts`
    *   ...

### 단계 3: Backend (Presigned URL) 수정
`.m3u8` 파일뿐만 아니라, 그 안에 적힌 `.ts` 파일들도 접근 권한이 있어야 합니다.
가장 쉬운 방법은 **CloudFront Signed Cookie**를 쓰는 것이지만, 현재 구조(Spring Boot + Presigned URL)를 유지하려면 다음 2가지 중 하나를 선택해야 합니다.

*   **방법 A (추천)**: Presigned URL 대신 **CloudFront Signed Cookie** 도입 (가장 깔끔함).
*   **방법 B (현재 구조 유지)**:
    1.  프론트에서 `.m3u8`을 요청 (Presigned URL 발급).
    2.  플레이어가 `.m3u8`을 읽음.
    3.  플레이어가 `.ts` 조각을 요청할 때마다 403 에러가 남.
    4.  **해결책**: S3 버킷 정책에서 해당 음악 폴더(`music/*`)를 특정 CloudFront OAC만 접근 가능하게 하고, CloudFront에서 Signed URL/Cookie를 검증하도록 아키텍처 업그레이드 필요.
    
    > **간단한 대안 (강력 추천)**: HLS로 넘어가면 **CloudFront**를 앞단에 붙이는 게 정신건강에 좋습니다. S3 직접 접근(Presigned URL)으로는 HLS 수백 개 조각에 일일리 서명하기가 너무 힘듭니다.

### 단계 4: Frontend (React) 수정
HTML5 `<audio>` 태그는 기본적으로 HLS(`.m3u8`)를 재생 못 합니다(사파리 제외).
**`hls.js`** 라이브러리나 **`react-player`**를 써야 합니다.

**설치**:
```bash
npm install react-player
# 또는
npm install hls.js
```

**코드 예시 (`MusicPlayer.jsx`)**:
```javascript
import ReactPlayer from 'react-player';

// ...
<ReactPlayer
    url='https://.../bgm1.m3u8' // CloudFront 주소
    playing={isPlaying}
    controls={true}
    config={{
        file: {
            forceHLS: true, // HLS 강제 활성화
            hlsOptions: {
                xhrSetup: function(xhr, url) {
                    // 필요한 경우 인증 헤더 추가
                    xhr.withCredentials = true; 
                }
            }
        }
    }}
/>
```

---

## 3. 요약: 나중에 할 일
1.  **FFmpeg**로 MP3를 변환한다.
2.  **CloudFront**를 배포하고, **Signed Cookie** 방식을 백엔드에 구현한다. (URL 서명보다 쿠키 서명이 HLS에 적합)
3.  프론트엔드에서 **`react-player`**로 교체한다.

이 문서를 보여주면 AI가 바로 코드를 짜줄 것입니다. 🚀
