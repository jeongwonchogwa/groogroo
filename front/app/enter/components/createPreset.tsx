"use client";

import Button from "../../components/Button";
import SmallButton from "../../components/SmallButton";
import NameInput from "../../components/NameInput";
import PixelCanvas from "./pixelCanvas";
import DrawingTools from "./DrawingTools";
import html2canvas from "html2canvas";
import Image from "next/image";
import React, { useState, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchWithTokenCheck } from "@/app/components/FetchWithTokenCheck";

const CreatePreset = () => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("canvas");
  const [selectedTool, setSelectedTool] = useState("pen"); // 기본 도구를 'pen'으로 설정
  const [selectedColor, setSelectedColor] = useState("black"); // 기본 색상을 'black'으로 설정
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [imageData, setImageData] = useState("");
  const [imageName, setImageName] = useState("");
  const [isBlank, setIsBlank] = useState<boolean>(true);
  const [userId, setUserId] = useState("");
  const [userToken, setUserToken] = useState("");
  const [credit, setCredit] = useState<number>(0);

  useEffect(() => {
    const userInfoString = sessionStorage.getItem("userInfo");
    if (!userInfoString) {
      router.push("/enter");
      throw new Error("사용자 정보가 없습니다.");
    }

    const userInfo = JSON.parse(userInfoString);
    const accessToken = userInfo?.state?.userToken;
    setUserToken(accessToken);

    const base64Url = accessToken.split(".")[1]; // JWT의 payload 부분 추출
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    setUserId(payload.id);
  }, []);

  const redirectHome = () => {
    router.push("/home");
  };

  // 크레딧 가져오기
  const getCredit = async () => {
    const getCredit = await fetchWithTokenCheck(
      `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/user`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }, router
    );
    
    if (getCredit.status === 200) {
      const responseData = await getCredit.json();
      setCredit(responseData.credit);
    }
  }

  const redirectCheck = (imageUrl: String) => {
    router.push(`/enter/check?selectedImageUrl=${imageUrl}`);
  };

  const handleCreateButtonClick = () => {
    if (selectedComponent === "canvas") {
      getImageDataFromCanvas();
      // router.push('/enter/pick');
    } else if (selectedComponent === "text") {
      let err = false;
      let msg = "";

      const regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;
      const containsNumber = /\d/.test(inputValue.trim());

      if (inputValue.trim() === "") {
        // inputValue가 비어있는 경우 알림 표시
        msg = "텍스트를 입력하세요.";
        err = true;
      } else if (!err && inputValue.trim().match(regExp)) {
        msg = "특수문자를 제거 해주세요.";
        err = true;
      } else if (!err && containsNumber) {
        msg = "숫자를 제거 해주세요.";
        err = true;
      } else {
        const foundBannedWord = checkBannedWords(inputValue);

        if (foundBannedWord) {
          msg = `${foundBannedWord}은/는 금칙어입니다.`;
          err = true;
        } else {
          fetchTextToFlask(inputValue);
        }
      }

      if (err) alert(msg);
    }
  };

  const checkBannedWords = (inputWord: String) => {
    const bannedWords = [
      "변태",
      "시발",
      "병신",
      "애미",
      "등신",
      "장애인",
      "아돌프 히틀러",
      "도널드 트럼프",
      "문재인",
      "윤석열",
      "박근혜",
      "노무현",
      "같은 새끼",
      "같은새끼",
      "개 새끼",
      "개같아",
      "개같은",
      "개같을",
      "개같게",
      "개나 소나",
      "개나대",
      "개나소나",
      "개넷",
      "개년",
      "개념빠가",
      "느갭",
      "느검",
      "도태남",
      "도태녀",
      "개독",
      "개돼지",
      "개련",
      "개련",
      "개부랄",
      "개삼성",
      "개새기",
      "개새끼",
      "개색",
      "개섹",
      "풀발",
      "씹선",
      "개셈",
      "개소리",
      "개쓰래기",
      "개저씨",
      "개줌마",
      "계새끼",
      "골 빈",
      "골1빈",
      "골빈",
      "괘새끼",
      "그1켬",
      "김치녀",
      "김치남",
      "김치놈",
      "김치년",
      "한녀",
      "한.녀",
      "한남들",
      "한.남",
      "그남들",
      "자들자들",
      "된장녀",
      "피싸개",
      "앙기모띠",
      "소추",
      "퍄퍄",
      "형보수지",
      "눈나",
      "김여사",
      "여적여",
      "자적자",
      "남적남",
      "보적보",
      "삼일한",
      "보슬아치",
      "보징어",
      "엑윽",
      "헤으응",
      "이기야",
      "부왘",
      "보픈카",
      "상폐녀",
      "배빵",
      "누보햄",
      "자박꼼",
      "로린 ",
      "아몰랑",
      "업계포상",
      "번녀",
      "번남",
      "대남",
      "대녀",
      "냄저",
      "빨갱",
      "뷔페미",
      "꼴페",
      "-2-",
      "-1-",
      "문재앙",
      "윤재앙",
      "펨베",
      "펨코",
      "펨.코",
      "엠팍",
      "쿰.척",
      "쿰척",
      "ㅗㅜㅑ",
      "오우야",
      "껒여",
      "꺼지세요",
      "꺼져요",
      "로 꺼져",
      "로꺼져",
      "로 꺼.져",
      "꺼.지",
      "꼴데",
      "설거지론",
      "퐁퐁남",
      "퐁퐁녀",
      "나쁜 새끼",
      "년놈",
      "노알라",
      "느그",
      "느금",
      "뇌 텅",
      "뇌1텅",
      "뇌텅",
      "눈깔 파",
      "눈깔파",
      "늬믜",
      "늬미",
      "니년",
      "니믜",
      "니미럴",
      "닝기리",
      "닥쳐라",
      "닥치세",
      "대가리",
      "머가리",
      "머.가리",
      "대.가리",
      "덬",
      "도라이",
      "뒈져",
      "뒤져라",
      "뒤져버",
      "뒤져야",
      "뒤져야지",
      "뒤져요",
      "뒤졌",
      "뒤지겠",
      "뒤지고싶",
      "뒤지길",
      "뒤진다",
      "뒤질",
      "디져라",
      "디졌",
      "디지고",
      "디질",
      "딴년",
      "아재요",
      "아재는",
      "네 아줌마",
      "네 아저씨",
      "네아줌마",
      "네아저씨",
      "뚝배기깨",
      "뚝배기 깨",
      "뚫린 입",
      "뚫린입",
      "라면갤",
      "런놈",
      "런년",
      "럼들",
      "레1친",
      "레기같",
      "레기네",
      "레기다",
      "레친",
      "xy들",
      "xx들",
      "련들",
      "롬들",
      "ㅁ.ㄱ",
      "ㅁㅊ",
      "ㅁ친",
      "맘충",
      "망돌",
      "머갈",
      "먹 금",
      "먹.금",
      "먹.끔",
      "먹1금",
      "먹금",
      "먹끔",
      "명존",
      "뭔솔",
      "미놈",
      "미시친발",
      "미쳣네",
      "미쳤니",
      "미친 새",
      "미친~",
      "미친개",
      "미친새",
      "미친색",
      "줘패",
      "꼬추",
      "미치ㄴ",
      "ㅅ.ㄲ",
      "색퀴",
      "ㅅ끼",
      "한남들",
      "흉자",
      "GR도",
      "미핀놈",
      "샛기",
      "폐급",
      "xportsnews",
      "G랄",
      "세키",
      "d져",
      "ㅂㅁㄱ",
      "ㅂㅊ",
      "ㅂ크",
      "발놈",
      "별창",
      "병1신",
      "병신",
      "봊",
      "보전깨",
      "싸개",
      "븅신",
      "빠큐",
      "빡새끼",
      "뻐규",
      "뻐큐",
      "뻑유",
      "뻑큐",
      "뻨큐",
      "뼈큐",
      "쉰내",
      "ㅄ",
      "ㅅ,ㅂ",
      "ㅅ.ㅂ",
      "ㅅ1ㅂ",
      "ㅅ1발",
      "ㅅㄲ네",
      "ㅅㅋ네",
      "ㅅㄲ들",
      "ㅅㅋ들",
      "친ㅅㄲ",
      "친 ㅅㄲ",
      "ㅅ1ㄲ",
      "ㅅㅌㅊ",
      "사새끼",
      "새.끼",
      "새1끼",
      "새1키",
      "새77ㅣ",
      "새끼라",
      "새끼야",
      "새퀴",
      "새킈",
      "새키",
      "색희",
      "색히",
      "샊기",
      "샊히",
      "샹년",
      "섀키",
      "서치해",
      "섬숭이",
      "성괴",
      "솔1친",
      "솔친",
      "쉬발",
      "쉬버",
      "쉬이바",
      "쉬이이",
      "쉬펄",
      "슈1발",
      "슈레기",
      "슈발",
      "슈벌",
      "슈우벌",
      "슈ㅣ발",
      "스벌",
      "슨상님",
      "싑창",
      "시1발",
      "시미발친",
      "시미친발",
      "시바류",
      "시바알",
      "시발",
      "toss.im",
      "metavv",
      "newspic",
      "salgoonews",
      "ㅅㅂ",
      "ㅅ.ㅂ",
      "닥 쳐",
      "하남자",
      "하 남자",
      "하여자",
      "하 여자",
      "쌉스",
      "썩열",
      "썩렬",
      "쎡열",
      "쎡렬",
      "먹버",
      "대깨",
      "야랄",
      "ㅂㅅ",
      "ㅂ.ㅅ",
      "한남노",
      "한남들",
      "한.남",
      "한1남",
      "한남을",
      "싸튀",
      "멍.청",
      "- 2 -",
      "- 1 -",
      "아줌내",
      "머깨",
      "등신아",
      "미친것",
      "개때리",
      "개떄려",
      "염병하",
      "염병짓",
      "종간나",
      "빠가사리",
      "새기들",
      "애새기",
      "ktestone",
      ":middle_finger:",
      "시방새",
      "시벌탱",
      "시볼탱",
      "시부럴",
      "시부렬",
      "시부울",
      "시뷰럴",
      "시뷰렬",
      "시빨",
      "시새발끼",
      "시이발",
      "시친발미",
      "시팔",
      "시펄",
      "십창",
      "퐁퐁단",
      "십팔",
      "ㅆ1ㄺ",
      "ㅆ1ㅂ",
      "ㅆㄹㄱ",
      "ㅆㄺ",
      "ㅆㅂ",
      "싸물어",
      "쌍년",
      "쌍놈",
      "쌔끼",
      "썅",
      "썌끼",
      "쒸펄",
      "쓰1레기",
      "쓰래기같",
      "쓰레기 새",
      "쓰레기새",
      "쓰렉",
      "씝창",
      "씨1발",
      "씨바라",
      "씨바알",
      "씨발",
      "씨.발",
      "씨방새",
      "씨버럼",
      "씨벌",
      "씨벌탱",
      "씨볼탱",
      "씨부럴",
      "link.coupang",
      "jigex.com",
      "씨부렬",
      "씨뷰럴",
      "씨뷰렬",
      "씨빠빠",
      "씨빨",
      "씨뻘",
      "씨새발끼",
      "씨이발",
      "씨팔",
      "씹귀",
      "씹못",
      "kko.to",
      "씹뻐럴",
      "씹새끼",
      "씹쌔",
      "씹창",
      "씹치",
      "씹팔",
      "씹할",
      "아가리",
      ":x:",
      "아닥",
      "더쿠",
      "덬",
      "더.쿠",
      "ㄷㅋ",
      "아오 ㅅㅂ",
      "아오 시바",
      "아오ㅅㅂ",
      "아오시바",
      "안물안궁",
      "애미",
      "앰창",
      "닥눈삼",
      "에라이 퉤",
      "에라이 퉷",
      "에라이퉤",
      "에라이퉷",
      "엠뷩신",
      "엠븽신",
      "엠빙신",
      "엠생",
      "엠창",
      "엿같",
      "엿이나",
      "옘병",
      "외1퀴",
      "외퀴",
      "웅앵",
      "웅엥",
      "은년",
      "은새끼",
      "이 새끼",
      "이새끼",
      "一 一",
      "一 ㅡ",
      "一一",
      "一ㅡ",
      "입 털",
      "입털",
      "ㅈ.ㄴ",
      "ㅈ소",
      "ㅈㄴ",
      "ㅈㄹ",
      "정신나갓",
      "정신나갔",
      "젖 같",
      "젗같",
      "젼나",
      "젼낰",
      "졀라",
      "졀리",
      "졌같은",
      "졏 같",
      "조온",
      "조온나",
      "족까",
      "존 나",
      "존 나",
      "존.나",
      "존1",
      "존1나",
      ":smoking:",
      "멍청",
      "능지",
      "조센징",
      "짱깨",
      "짱개",
      "짱꼴라",
      "착짱",
      "죽짱",
      "착.짱",
      "죽.짱",
      "착1짱",
      "죽1짱",
      "짱골라",
      "좃",
      "종나",
      "곱창났",
      "곱창나",
      "좆",
      "좁밥",
      "좋소",
      "좇같",
      "죠낸",
      "죠온나",
      "죤나",
      "죤내",
      "죵나",
      "죶",
      "죽어버려",
      "죽여 버리고",
      "죽여버리고",
      "죽여불고",
      "죽여뿌고",
      "줬같은",
      "쥐랄",
      "쥰나",
      "쥰내",
      "쥰니",
      "쥰트",
      "즤랄",
      "지 랄",
      "지1랄",
      "지1뢰",
      "지랄",
      "ezr",
      "2zr",
      "2gr",
      "지롤",
      "석 렬",
      "썩 렬",
      "썩 열",
      "찢재",
      "찢 재",
      "찢1",
      "ㅁ청",
      "ㅉ",
      "ㅉ질한",
      "짱깨",
      "짱께",
      "쪼녜",
      "착짱죽짱",
      "섬숭이",
      "쪽본",
      "쪽1바리",
      "쪽바리",
      "쪽발",
      "쫀 맛",
      "쫀1",
      "쫀귀",
      "쫀맛",
      "쫂",
      "쫓같",
      "쬰잘",
      "쬲",
      "쯰질",
      "찌1질",
      "찌질한",
      "찍찍이",
      "찎찎이",
      "찝째끼",
      "창년",
      "창녀",
      "창남",
      "창놈",
      "창넘",
      "처먹",
      "凸",
      "첫빠",
      "쳐마",
      "쳐먹",
      "쳐받는",
      "쳐발라",
      "취ㅈ",
      "취좃",
      "친 년",
      "한 년",
      "친 놈",
      "친구년",
      "친년",
      "한년",
      "친노마",
      "친놈",
      "친넘",
      "ㅍㅌㅊ",
      "핑1프",
      "핑거프린세스",
      "핑끄",
      "핑프",
      "ㅎㅃ",
      "ㅎㅌㅊ",
      "손놈",
      "호로새끼",
      "호로잡",
      "화낭년",
      "화냥년",
      "후1빨",
      "후빨",
    ];

    for (const word of bannedWords) {
      const regex = new RegExp(word, "gi"); // 대소문자 구분 없이 검색
      if (inputWord.match(regex)) {
        return word; // 첫 번째 발견된 금칙어를 반환
      }
    }
    return null; // 금칙어가 없는 경우 null 반환
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSelectTool = (tool: string) => {
    setSelectedTool(tool); // 선택한 도구를 업데이트
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color); // 선택한 색상을 업데이트
    setSelectedTool("pen"); // 색 변경하면 도구도 펜으로 변경
  };

  const getImageDataFromCanvas = () => {
    const gridElement = document.getElementById("pixel-grid");

    if (gridElement) {
      html2canvas(gridElement).then((canvas) => {
        canvas.toBlob((blob: Blob | null) => {
          const formData = new FormData();
          if (blob) {
            formData.append("image", blob);
            formData.append("id", userId);
            fetchImageToFlask(formData);
          }
        }, "image/png");
      });
    }
  };

  const fetchImageToFlask = async (formData: FormData) => {
    setIsLoading(true);
    if (formData) {
      try {
        const response = await fetchWithTokenCheck(
          `${process.env.NEXT_PUBLIC_GROOGROO_FLASK_API_URL}/remove_bg`,
          {
            method: "POST",
            body: formData,
          },
          router
        );

        if (response?.status === 200) {
          setIsLoading(false);
          // image_data - 형식은 base64
          const data = await response.json();
          setImageData(data.image_data); // 이미지 데이터를 상태 변수에 저장
          setImageName(data.image_name); // 이미지 url을 변수에 저장
          setIsGenerated(true);

          // 크레딧 차감
          const useCredit = await fetchWithTokenCheck(
            `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/user/credit`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }, router
          );

          if (useCredit?.status === 200) {
            console.log('크레딧 차감 성공');
            getCredit();
          }

        } else {
          console.log("Server Response Error:", response?.status);
        }
      } catch (error) {
        console.log("이미지 전송 실패:", error);
      }
    } else {
      console.log("이미지 데이터가 없습니다.");
    }
  };

  const fetchTextToFlask = async (inputData: string) => {
    setIsLoading(true);
    try {
      const response = await fetchWithTokenCheck(
        `${process.env.NEXT_PUBLIC_GROOGROO_FLASK_API_URL}/make_image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: inputData,
            id: userId, // 실제 아이디 가져와서 바꿔놔야할 부분
          }),
        },
        router
      );

      if (response?.status === 200) {
        setIsLoading(false);
        // image_data - 형식은 base64
        const data = await response.json();
        setImageData(data.image_data); // 이미지 데이터를 상태 변수에 저장
        setImageName(data.image_name); // 이미지 url을 변수에 저장
        setIsGenerated(true);
        // router.push(`/enter/pick/${responseData.image_url}`)
      } else {
        console.log("Server Response Error:", response?.status);
      }
    } catch (error) {
      console.log("요청실패:", error);
    }
  };

  const handleSelectButtonClick = async () => {
    const base64String = `data:image/png;base64,${imageData}`;

    // Base64 문자열을 Blob 객체로 변환
    const blob = await (await fetch(base64String)).blob();

    // FormData 객체 생성
    const formData = new FormData();
    formData.append("multipartFile", blob, imageName);

    // 서버에 S3 POST 요청 보내기
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree/image`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.status === 200) {
        // 처리 성공
        const responseData = await response.json();
        const imageUrl = responseData.imageUrl; // imageUrl 추출

        // 프리셋 저장
        try {
          const updatePreset = await fetch(
            `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree/preset`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
              body: JSON.stringify({
                imageUrl: imageUrl,
              }),
            }
          );

          if (updatePreset.status === 200) {
            // 프리셋 업데이트 성공
          } else {
            // 프리셋 업데이트 실패
            alert("생성한 이미지를 프리셋으로 저장하는 데 실패했습니다.");
            console.log("프리셋 저장 실패");
          }
        } catch (error) {
          alert("생성한 이미지를 프리셋으로 저장하는 데 실패했습니다.");
          console.error("요청 실패", error);
        }

        // redirectCheck();
        redirectHome();
      } else {
        // 처리 실패
        alert("생성한 이미지를 서버에 저장하는 데 실패했습니다.");
        console.log("이미지 업로드 실패");
      }
    } catch (error) {
      alert("생성한 이미지를 서버에 저장하는 데 실패했습니다.");
      console.error("요청 실패", error);
    }
  };

  const checkIsBlank = (isBlank: boolean) => {
    setIsBlank(isBlank);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-col items-center mt-20">
        <p className="font-bitBit text-[48px]" style={{ marginBottom: 0 }}>
          프리셋 만들기
        </p>
        <p className="font-nexonGothic text-[18px]" style={{ marginBottom: 0 }}>
          나만의 나무를 만들어보세요!
        </p>
      </div>
      <div className="flex flex-row justify-end items-center">
        <Image className="flex" src="/assets/images/coin.png" alt="코인 이미지" width={40} height={40} priority/>
          <span className="my-auto flex font-nexonGothic">{credit}</span>
      </div>
      <div className="w-full flex flex-col items-center">
        <div className="w-full flex space-x-8 mt-5 mb-3">
          <SmallButton
            color={selectedComponent === "canvas" ? "default" : "white"}
            label="이미지"
            onClick={() => {
              setSelectedComponent("canvas");
              setInputValue("");
            }}
          />
          <SmallButton
            color={selectedComponent === "text" ? "default" : "white"}
            label="텍스트"
            onClick={() => {
              setSelectedComponent("text");
              setIsBlank(true);
            }}
          />
        </div>
        {selectedComponent === "canvas" ? (
          isLoading ? (
            <div className="bg-white w-[256px] h-[256px] flex items-center justify-center">
              <Image
                alt="loading"
                src={"/assets/gif/loading.gif"}
                width={100}
                height={30}
              ></Image>
            </div>
          ) : (
            <>
              <DrawingTools
                onSelectTool={(tool) => handleSelectTool(tool)}
                onColorChange={(color) => handleColorChange(color)}
              />

              <PixelCanvas
                selectedTool={selectedTool}
                selectedColor={selectedColor}
                checkIsBlank={checkIsBlank}
              />
            </>
          )
        ) : null}
        {selectedComponent === "text" ? (
          isGenerated && imageData ? (
            <div className="bg-white w-[256px] h-[256px] flex items-center justify-center">
              <Image
                className="mt-5"
                src={`data:image/png;base64,${imageData}`}
                alt="생성된 이미지"
                width={128}
                height={128}
                priority
              />
            </div>
          ) : isLoading ? (
            <div className="bg-white w-[256px] h-[256px] flex items-center justify-center">
              <Image
                alt="loading"
                src={"/assets/gif/loading.gif"}
                width={100}
                height={30}
              ></Image>
            </div>
          ) : (
            <div className="bg-white w-[256px] h-[256px] flex items-center justify-center">
              <Image
                alt="none"
                src={"/assets/images/question.svg"}
                width={73}
                height={99}
              ></Image>
            </div>
          )
        ) : null}
        {selectedComponent === "text" && (
          <NameInput
            placeholder="뿡뿡이나무"
            value={inputValue}
            onChange={handleInputChange}
          />
        )}{" "}
        {/* NameInput 컴포넌트를 렌더링 */}
        <div className="w-full h-[20px] flex justify-end mr-20"></div>
        <div className="w-[80%] mt-[30px] ">
          {isGenerated ? (
            <>
              <div className="grid grid-flow-col gap-4">
                <Button
                  color="primary"
                  label={credit > 0 ? "다시 생성" : "크레딧부족"}
                  onClick={handleCreateButtonClick}
                  disabled={credit <= 0}
                />
                <Button
                  color="primary"
                  label="결정하기"
                  onClick={handleSelectButtonClick}
                />
              </div>
            </>
          ) : selectedComponent === "canvas" ? (
            <Button
              color={isBlank ? "default" : "primary"}
              label="생성하기"
              onClick={handleCreateButtonClick}
              disabled={isBlank}
            />
          ) : (
            <Button
              color={inputValue == "" ? "default" : "primary"}
              label={credit > 0 ? "생성하기" : "크레딧부족"}
              onClick={handleCreateButtonClick}
              disabled={inputValue == "" || credit <= 0}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePreset;
