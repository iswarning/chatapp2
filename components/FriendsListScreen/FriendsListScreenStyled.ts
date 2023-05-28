import styled from "styled-components"

const Row = styled.div.attrs(() => ({
    className: 'row'
}))`
    /* width: 100%; */
`;

const Col = styled.div.attrs(() => ({
    className: 'col-xl-3 col-md-4 col-sm-4'
}))`
    
`;

export { Row, Col }