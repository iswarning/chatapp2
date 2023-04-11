import EditIcon from '@mui/icons-material/Edit';
import { BtnContainer, Container, InformationContainer, Label, TextGroup, TextGroupCol, TextGroupRow, TextName, UpdateButton, Upper, UpperImage, UserAvatar, UserContainer, UserProfile, Value, ValueContainer } from "./ProfileStyled";

export default function Profile({userInfo}: any) {



    return (
        <Container>
            <Upper>
                {/* <UpperImage src={userInfo?.upperImage ?? '/images/upper-image-default.png'} /> */}
            </Upper>
            <UserContainer>
                <UserProfile>
                    {/* <UserAvatar src={userInfo?.avatar ?? '/images/avatar-default.jpg'} /> */}
                </UserProfile>
            </UserContainer>
            
            <InformationContainer>
                <TextName>{ userInfo?.name ? userInfo?.name : 'Albert Einstein'}</TextName>
                <TextGroupRow>
                    <TextGroupCol>
                        <TextGroup>
                            <Label>Email:</Label>
                            <ValueContainer>
                                <Value>{ userInfo?.email ? userInfo?.email : 'mail@gmail.com'}</Value>
                            </ValueContainer>
                        </TextGroup>
                    </TextGroupCol>
                </TextGroupRow>
                <TextGroupRow>
                    <TextGroupCol>
                        <TextGroup>
                            <Label>Birthdate:</Label>
                            <ValueContainer>
                                <Value>{ userInfo?.birthdate ? userInfo?.birthdate : '21/12/2012'}</Value>
                            </ValueContainer>
                        </TextGroup>
                    </TextGroupCol>
                </TextGroupRow>
                <TextGroupRow>
                    <TextGroupCol>
                        <TextGroup>
                            <Label>Birth Place:</Label>
                            <ValueContainer>
                                <Value>{ userInfo?.birth_place ? userInfo?.birth_place : 'Los Angeles California San Fransisco'}</Value>
                            </ValueContainer>
                        </TextGroup>
                    </TextGroupCol>
                </TextGroupRow>
                <TextGroupRow>
                    <TextGroupCol>
                        <TextGroup>
                            <Label>Gender:</Label>
                            <ValueContainer>
                                <Value>{ userInfo?.gender ? userInfo?.gender : 'Male'}</Value>
                            </ValueContainer>
                        </TextGroup>
                    </TextGroupCol>
                </TextGroupRow>             
                <TextGroupRow>
                    <TextGroupCol>
                        <TextGroup>
                            <Label>Phone:</Label>
                            <ValueContainer>
                                <Value>{ userInfo?.phone ? userInfo?.phone : '0903123456'}</Value>
                            </ValueContainer>
                        </TextGroup>
                    </TextGroupCol>
                </TextGroupRow>
                <BtnContainer>
                    <UpdateButton>
                        <EditIcon fontSize="medium" />&nbsp;Edit Information
                    </UpdateButton>
                </BtnContainer>
            </InformationContainer>
        </Container>
    )
}



