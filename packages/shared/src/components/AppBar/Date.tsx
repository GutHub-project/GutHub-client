import FireIcon from "./FireIcon"
import FlexBox from "./FlexBox"
import Text from "./Text"

const Date = ({ date }: { date: string }) => {
  return (
    <FlexBox className="gap-0">
      <Text className="text-[16px] pt-[3px]">{date}</Text>
      <FireIcon />
    </FlexBox>
  )
}

export default Date;