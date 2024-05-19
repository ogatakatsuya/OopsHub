import {
    Container,
    Stack,
    Flex,
    Box,
    Heading,
    Text,
    Button,
    Image,
    Icon,
    IconButton,
    createIcon,
    IconProps,
    useColorModeValue,
    Avatar,
} from '@chakra-ui/react';
import { MdHowToVote } from "react-icons/md";
export default function CallToActionWithVideo() {
    return (
        <>
    <Container maxW={'5xl'}>
        <Stack
        align={'center'}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
        direction={{ base: 'column', md: 'row' }}>
        <Stack flex={1} spacing={{ base: 5, md: 10 }}>
            <Heading
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}>
            <Text
                as={'span'}
                position={'relative'}
                _after={{
                content: "''",
                width: 'full',
                height: '30%',
                position: 'absolute',
                bottom: 1,
                left: 0,
                bg: 'blue.200',
                zIndex: -1,
                }}>
                AIと一緒に
            </Text>
            <br />
            <Text as={'span'} color={'blue.300'}>
                失敗を乗り越える
            </Text>
            </Heading>
            <Text color={'gray.500'}>
            エンジニアリング、ビジネス、教育、人間関係など、あらゆる場面での失敗に対する支援を行います。
            挫折から学び、成長するために、AIがあなたのそばにいます。
            </Text>
        </Stack>
        <Flex
        flex={1}
        justify={'center'}
        align={'center'}
        position={'relative'}
        w={'full'}>
            <Box
            position={'relative'}
            height={'320px'}
            rounded={'2xl'}
            boxShadow={'2xl'}
            width={'full'}
            overflow={'hidden'}>
                <Stack spacing={4}>
                    <Flex alignItems="center" mb={4} mt={6} mx={4}>
                        <Avatar />
                        <Box ml={3} bg={'gray.100'} p={3} rounded={'lg'}>
                            <Text>初日からサーバーの設定をいじって、間違えて全体のデータベースを消しちゃったんです。先輩たちにすぐにバックアップを復元してもらったけど、本当に焦りました！</Text>
                        </Box>
                    </Flex>
                    <Flex alignItems="center" justifyContent="flex-end" mb={6} mx={4}>
                        <Box mr={3} bg={'gray.100'} p={3} rounded={'lg'}>
                            <Text>バックアップがあってよかったね！次回からは設定を変更する前に必ずバックアップを取る習慣をつけよう。失敗は学びのチャンスだよ！君ならもっと成長できるからね！😊</Text>
                        </Box>
                        <Avatar />
                    </Flex>
                </Stack>
            </Box>
        </Flex>
        </Stack>
    </Container>
    <Container maxW={'5xl'}>
        <Stack
        align={'center'}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
        direction={{ base: 'column', md: 'row' }}>
        <Stack flex={1} spacing={{ base: 5, md: 10 }}>
            <Heading
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}>
            <Text
                as={'span'}
                position={'relative'}
                _after={{
                content: "''",
                width: 'full',
                height: '30%',
                position: 'absolute',
                bottom: 1,
                left: 0,
                bg: 'yellow.200',
                zIndex: -1,
                }}>
                失敗を
            </Text>
            <br />
            <Text as={'span'} color={'yellow.300'}>
                笑いに変える
            </Text>
            </Heading>
            <Text color={'gray.500'}>
            失敗は誰にでもありますが、それをシェアし、笑いに変えることで、その重荷を軽くし、前進する勇気を与えます。
            一つの失敗談が笑い話に変わることで、他の人々も自分の失敗を受け入れ、共感し、励まし合うことができます。失敗は笑いと共に、新たな可能性が広がります。
            </Text>
        </Stack>
        <Flex
        flex={1}
        justify={'center'}
        align={'center'}
        position={'relative'}
        w={'full'}>
        <Box
        position={'relative'}
        height={'320px'}
        rounded={'2xl'}
        boxShadow={'2xl'}
        width={'full'}
        overflow={'hidden'}>
        <Stack spacing={4} justify="center" align="center" mt={6}>
            <Heading size="md" mt={4}>お題 : 面白い失敗談</Heading>
        </Stack>
        <Flex
            direction="column"
            justify="center"
            align="center"
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            p={4}
            borderTopRadius="2xl"
        >
            <Box mx="auto" mt={5} width={['100%', '90%', '80%', '70%']}>
            <Stack direction="row">
                <Avatar boxSize={10} />
                <Flex flex={1} direction="column" alignItems={'start'}>
                <Stack direction={'row'} alignItems={'center'}>
                    <Text fontSize={14} fontWeight={'bold'} color="black">
                    ユーザー名
                    </Text>
                    <Text fontSize={12} color="black">2024/04/06</Text>
                </Stack>
                <Box>
                    <Text fontSize={14} px={2} py={1} color="black">
                    友人が英会話学校でのボランティアに参加した。生徒の一人に「What's up?」と尋ねられ、彼は本気でその意味を解釈して「天井だよ！」と答えた。クラスが爆笑し、その後は「What's going on?」という表現を学んだ。
                    </Text>
                </Box>
                </Flex>
            </Stack>
            <Flex justifyContent="flex-end" mt={2}>
                <Text fontSize={12}>投票する</Text>
                <MdHowToVote/>
            </Flex>
            </Box>
        </Flex>
        </Box>

        </Flex>

        </Stack>
    </Container>
        </>
    );
}

const PlayIcon = createIcon({
    displayName: 'PlayIcon',
    viewBox: '0 0 58 58',
    d:
    'M28.9999 0.562988C13.3196 0.562988 0.562378 13.3202 0.562378 29.0005C0.562378 44.6808 13.3196 57.438 28.9999 57.438C44.6801 57.438 57.4374 44.6808 57.4374 29.0005C57.4374 13.3202 44.6801 0.562988 28.9999 0.562988ZM39.2223 30.272L23.5749 39.7247C23.3506 39.8591 23.0946 39.9314 22.8332 39.9342C22.5717 39.9369 22.3142 39.8701 22.0871 39.7406C21.86 39.611 21.6715 39.4234 21.5408 39.1969C21.4102 38.9705 21.3421 38.7133 21.3436 38.4519V19.5491C21.3421 19.2877 21.4102 19.0305 21.5408 18.8041C21.6715 18.5776 21.86 18.3899 22.0871 18.2604C22.3142 18.1308 22.5717 18.064 22.8332 18.0668C23.0946 18.0696 23.3506 18.1419 23.5749 18.2763L39.2223 27.729C39.4404 27.8619 39.6207 28.0486 39.7458 28.2713C39.8709 28.494 39.9366 28.7451 39.9366 29.0005C39.9366 29.2559 39.8709 29.507 39.7458 29.7297C39.6207 29.9523 39.4404 30.1391 39.2223 30.272Z',
});
