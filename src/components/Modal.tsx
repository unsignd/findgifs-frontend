import styled from 'styled-components';
import { ReactComponent as XSvg } from '../assets/x_20.svg';
import { ReactComponent as SearchSVG } from '../assets/search_20.svg';
// import { ReactComponent as DropdownArrowSVG } from '../assets/dropdown_arrow_12.svg';
import { ReactComponent as CheckSVG } from '../assets/check_20.svg';
// import { ReactComponent as TagSVG } from '../assets/tag_20.svg';
import { useEffect, useRef, useState } from 'react';
import { api } from '../configs/axios';
import { modalActiveState, modalIsPromptedState } from '../modules/atoms';
import { useRecoilState } from 'recoil';
import Skeleton from 'react-loading-skeleton';

const Wrapper = styled.div`
  width: 500px;

  max-width: 100%;
`;

const Header = styled.div`
  width: 100%;
  height: 50px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 20px;

  background-color: var(--brightness-200);
  border-bottom: 1px solid var(--brightness-300);
`;

const Heading = styled.p`
  color: var(--brightness-500);
`;

const CancelButton = styled.button`
  width: 20px;
  height: 20px;

  cursor: pointer;
`;

const BannerGroup = styled.div`
  width: 100%;
  height: 120px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0) 100%),
    linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0) 100%),
    linear-gradient(
      90deg,
      rgba(1, 1, 1, 0) 0%,
      rgba(255, 255, 255, 0.14) 35%,
      rgba(255, 255, 255, 0.15) 40%,
      rgba(255, 255, 255, 0.15) 60%,
      rgba(255, 255, 255, 0.15) 65%,
      rgba(1, 1, 1, 0) 100%
    ),
    linear-gradient(
      90deg,
      rgba(112, 0, 255, 0.25) 0%,
      rgba(0, 178, 255, 0.25) 50%,
      rgba(255, 229, 0, 0.25) 100%
    ),
    linear-gradient(
      90deg,
      rgba(1, 1, 1, 0) 0%,
      rgba(0, 85, 255, 0.2) 20%,
      rgba(0, 85, 255, 0.25) 25%,
      rgba(0, 255, 133, 0.25) 75%,
      rgba(0, 255, 133, 0.2) 80%,
      rgba(1, 1, 1, 0) 100%
    ),
    #010101;
  border-bottom: 1px solid var(--brightness-200);
`;

const BannerText = styled.p`
  font-size: 22px;
  font-weight: 500;
  text-align: center;
  letter-spacing: -0.32px;
  white-space: pre-wrap;

  color: var(--brightness-100);
`;

const SearchGroup = styled.div`
  width: 100%;
  height: 40px;

  display: flex;
  justify-content: space-between;

  margin: 30px 0;
  padding: 0 20px;
`;

// const Dropdown = styled.div`
//   width: 90px;
//   height: 40px;

//   display: flex;
//   gap: 6px;
//   align-items: center;
//   justify-content: center;

//   background-color: var(--brightness-100);
//   border: 1px solid var(--brightness-300);
//   border-radius: 20px;

//   cursor: pointer;
// `;

const SearchBar = styled.div`
  /* width: calc(100% - 90px - 10px); */
  width: 100%;
  height: 40px;

  display: flex;
  align-items: center;

  padding: 0 12px;

  background-color: var(--brightness-200);
  border-radius: 6px;
`;

const SearchIcon = styled(SearchSVG)`
  color: var(--brightness-400);
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;

  margin-left: 8px;

  color: var(--brightness-500);

  &::placeholder,
  &::-webkit-input-placeholder {
    color: var(--brightness-400);
  }

  &:-ms-input-placeholder {
    color: var(--brightness-400);
  }
`;

const SelectGroup = styled.div<{
  $active: boolean;
}>`
  width: 100%;
  height: ${(props) => (props.$active ? 189 : 0)}px;

  padding: 0 20px;

  transition: height 250ms ease;

  overflow: hidden;
`;

const CategoryTitle = styled.p`
  padding-bottom: 10px;

  font-size: 16px;

  & span {
    color: var(--brightness-400);
  }
`;

const ImageGroup = styled.div<{
  $isLoaded: boolean;
  $isValid: boolean;
}>`
  width: 100%;
  height: 130px;

  position: relative;
  margin-bottom: 30px;

  display: flex;
  gap: 10px;

  overflow-x: ${(props) =>
    props.$isLoaded && props.$isValid ? 'scroll' : 'hidden'};
  overflow-y: hidden;
`;

const NotFoundWrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const NotFoundImageGroup = styled.div`
  display: flex;

  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;

const NotFoundImage = styled.img`
  width: 70px;
  height: 70px;
`;

const NotFoundText = styled.p`
  font-size: 14px;

  color: var(--brightness-400);
`;

const ImageWrapper = styled.div<{
  $visible: boolean;
}>`
  position: relative;

  display: ${(props) => (props.$visible ? 'inline' : 'none')};

  cursor: pointer;
`;

const CheckMarkWrapper = styled.div<{
  $visible: boolean;
}>`
  width: 40px;
  height: 40px;

  position: absolute;
  top: calc(50% - 2px);
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: var(--purple-100);
  color: var(--purple-300);
  border-radius: 20px;

  transition: opacity 100ms ease;

  opacity: ${(props) => (props.$visible ? 1 : 0)};
  z-index: 1;
`;

const SelectionOverlay = styled.div<{
  $visible: boolean;
}>`
  width: 100%;
  height: calc(100% - 4px);

  position: absolute;

  background-color: var(--purple-300);

  transition: opacity 100ms ease;

  opacity: ${(props) => (props.$visible ? 0.4 : 0)};
`;

const Image = styled.img`
  height: calc(100% - 4px);
`;

const SkeletonWrapper = styled.div<{
  $visible: boolean;
}>`
  height: calc(100% - 6px);

  display: ${(props) => (props.$visible ? 'flex' : 'none')};
  gap: 10px;
`;

const Footer = styled.div`
  width: 100%;
  height: 40px;

  padding: 0 20px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FooterText = styled.p`
  max-width: calc(100% - 100px);

  font-size: 14px;

  color: var(--brightness-400);
`;

const SubmitButton = styled.button<{
  $disabled?: boolean;
}>`
  height: 40px;

  padding: 0 17.5px;

  background-color: var(--purple-300);
  color: var(--brightness-100);
  border-radius: 6px;

  transition: opacity 100ms ease;

  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
`;

export function Modal() {
  const [searchQuery, setSearchQuery] = useState<string>();
  const [gifs, setGifs] = useState<string[]>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [selection, setSelection] = useState<string>();
  const [resetStatus, reset] = useState<boolean>(true);
  const [randomNumber] = useState<number>(Math.floor(Math.random() * 13));

  const [, setIsActive] = useRecoilState(modalActiveState);
  const [isPrompted, setIsPrompted] = useRecoilState(modalIsPromptedState);

  const searchRef: {
    current: any;
  } = useRef(null);

  useEffect(() => {
    reset(false);
  }, []);

  useEffect(() => {
    setGifs(undefined);
    setIsLoaded(false);
    setSelection(undefined);

    setIsPrompted(
      searchRef.current !== null &&
        searchRef.current.value === searchQuery &&
        searchRef.current.value.replace(/ /g, '') !== ''
    );

    const timer = setTimeout(() => {
      if (isPrompted) {
        api.get(`/search?query=${searchQuery}`).then((res) => {
          setGifs(res.data.data);

          setTimeout(() => {
            setIsLoaded(true);
          }, 400);
        });
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [isPrompted, searchQuery, searchRef, setIsPrompted]);

  return (
    <Wrapper>
      <Header>
        <Heading>Contribute a GIF</Heading>
        <CancelButton
          onClick={(event) => {
            event.preventDefault();

            setIsActive(false);
          }}
        >
          <XSvg />
        </CancelButton>
      </Header>
      <BannerGroup>
        <BannerText>
          Upload hidden GIFs,{'\n'}contribute the community.
        </BannerText>
      </BannerGroup>
      <SearchGroup>
        <SearchBar>
          <SearchIcon />
          <SearchInput
            placeholder="Search GIF on Giphy"
            maxLength={50}
            onChange={(event) => setSearchQuery(event.target.value)}
            ref={searchRef}
          />
        </SearchBar>
      </SearchGroup>
      <SelectGroup $active={isPrompted && !resetStatus}>
        <CategoryTitle>Select a GIF from the results below</CategoryTitle>
        <ImageGroup
          $isLoaded={isLoaded}
          $isValid={gifs !== undefined && gifs.length !== 0}
        >
          <SkeletonWrapper $visible={!isLoaded}>
            <Skeleton width={100} height={'100%'} />
            <Skeleton width={160} height={'100%'} />
            <Skeleton width={200} height={'100%'} />
            <Skeleton width={160} height={'100%'} />
          </SkeletonWrapper>
          {gifs === undefined ? undefined : gifs.length === 0 ? (
            <NotFoundWrapper>
              <NotFoundImageGroup>
                <NotFoundImage
                  src={require(`../assets/albums/${randomNumber}.png`)}
                  draggable="false"
                />
              </NotFoundImageGroup>
              <NotFoundText>
                No results, but here's a dope album :)
              </NotFoundText>
            </NotFoundWrapper>
          ) : (
            gifs.map((gif, index) => (
              <ImageWrapper
                key={index}
                $visible={isLoaded}
                onClick={() => {
                  setSelection(selection === gif ? undefined : gif);
                }}
              >
                <CheckMarkWrapper $visible={selection === gif}>
                  <CheckSVG />
                </CheckMarkWrapper>
                <SelectionOverlay $visible={selection === gif} />
                <Image src={gif} />
              </ImageWrapper>
            ))
          )}
        </ImageGroup>
      </SelectGroup>
      {/* <TagGroup>
        <CategoryTitle>
          Put your Instagram ID <span>(optional)</span>
        </CategoryTitle>
        <TagBar>
          <TagIcon />
          <TagInput />
        </TagBar>
      </TagGroup> */}
      <Footer>
        <FooterText>Submissions will be displayed after reviews.</FooterText>
        <SubmitButton
          $disabled={!selection}
          onClick={async (event) => {
            event.preventDefault();

            if (!selection) return;

            await api.post('/submit', {
              name: searchQuery,
              url: selection,
            });

            setIsActive(false);
          }}
        >
          Submit
        </SubmitButton>
      </Footer>
    </Wrapper>
  );
}
