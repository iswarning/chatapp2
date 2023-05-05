import styled from "styled-components"

const Row = styled.div.attrs(() => ({
    className: 'row'
}))`
    /* width: 100%; */
`;

const Col = styled.div.attrs(() => ({
    className: 'col-xl-2 col-md-3 col-sm-3'
}))`
    
`;

export { Row, Col }