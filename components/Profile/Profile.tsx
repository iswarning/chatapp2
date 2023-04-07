import EditIcon from '@mui/icons-material/Edit';
import { BtnContainer, Container, InformationContainer, Label, TextGroup, TextGroupCol, TextGroupRow, TextName, UpdateButton, Upper, UpperImage, UserAvatar, UserContainer, UserProfile, Value, ValueContainer } from "./ProfileStyled";

export default function Profile() {

    return (
        <Container>
            <Upper>
                <UpperImage src="https://images2.thanhnien.vn/Uploaded/sangdt/2022_03_16/jujutsu-kaisen-0-486.jpg" />
            </Upper>
            <UserContainer>
                <UserProfile>
                    <UserAvatar src='https://khoinguonsangtao.vn/wp-content/uploads/2022/07/avatar-cute-2-560x560.jpg' />
                </UserProfile>
            </UserContainer>
            
            <InformationContainer>
                <TextName>Albert Einstein</TextName>
                <TextGroupRow>
                    <TextGroupCol>
                        <TextGroup>
                            <Label>Birthdate:</Label>
                            <ValueContainer>
                                <Value>21/12/2012</Value>
                            </ValueContainer>
                        </TextGroup>
                    </TextGroupCol>
                </TextGroupRow>
                <TextGroupRow>
                    <TextGroupCol>
                        <TextGroup>
                            <Label>Birth Place:</Label>
                            <ValueContainer>
                                <Value>Los Angeles</Value>
                            </ValueContainer>
                        </TextGroup>
                    </TextGroupCol>
                </TextGroupRow>
                <TextGroupRow>
                    <TextGroupCol>
                        <TextGroup>
                            <Label>Gender:</Label>
                            <ValueContainer>
                                <Value>Male</Value>
                            </ValueContainer>
                        </TextGroup>
                    </TextGroupCol>
                </TextGroupRow>             
                <TextGroupRow>
                    <TextGroupCol>
                        <TextGroup>
                            <Label>Phone:</Label>
                            <ValueContainer>
                                <Value>0903123456</Value>
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



